import React, { useState, useEffect, useMemo } from "react";

import { AgGridReact, AgGridColumn } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { Grid, Button } from "@material-ui/core";
import FormDialog from "./components/dialog";
import useFetch from "./components/useFetch";
import diff from "./components/diff";

import axios from "axios";

const initialValue = { Name: "", Vorname: "", Strasse: "", PLZ: "", Ort: "" };

function App() {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialValue);
  const [oldFormData, setOldFormData] = useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialValue);
  };

  const url = `http://scheffler-hardcore.de:2010/hardcore/dp/DP_T_Mitarbeiter?$expand=fkLohnartID`;
  const columnDefs = [
    { headerName: "Name", field: "Name", cellRenderer: "agGroupCellRenderer" },
    { headerName: "Vorname", field: "Vorname" },
    { headerName: "Strasse", field: "Strasse" },
    { headerName: "PLZ", field: "PLZ" },
    { headerName: "Ort", field: "Ort" },
    {
      headerName: "ID",
      field: "id",
      cellRendererFramework: (
        params //gibt offensichtlich die aktuelle row zurück
      ) => (
        <div>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleUpdate(params.data)}>
            Update
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleDelete(params.value)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  //fetching user data from server
  const data = useFetch(url, setTableData);

  const deleteUsers = async (id) => {
    var url = `http://scheffler-hardcore.de:2010/hardcore/dp/DP_T_Mitarbeiter`;
    const result = await axios.delete(url + `(${id})`);
    if (result.status === 204) {
      getUsers();
    }
    console.log(result);
  };

  const patchUsers = async (id, data) => {
    var url = `http://scheffler-hardcore.de:2010/hardcore/dp/DP_T_Mitarbeiter`;
    var expand = `?$expand=fkLohnartID, fkJobsID`;
    const result = await axios.patch(url + id + expand, data);
    if (result.status === 200) {
      getUsers();
    }
  };

  const createUser = async (data) => {
    const jobResult = await axios.post(
      `http://scheffler-hardcore.de:2010/hardcore/dp/DP_L_Job`,
      { fest: 0 }
    );
    if (jobResult.status === 201) {
      data.fkJobsID = { job_id: jobResult.data.job_id };
    }

    const lohnResult = await axios.post(
      `http://scheffler-hardcore.de:2010/hardcore/dp/DP_T_Lohnform`,
      { MaxLohn: 0 }
    );
    if (lohnResult.status === 201) {
      data.fkLohnartID = { id: lohnResult.data.id };
    }

    const result = await axios.post(url, data);
    if (result.status === 201) {
      getUsers();
    }
  };

  const getUsers = async () => {
    const result = await axios.get(url);
    if (result.status == 200) {
      setTableData(result.data.value);
    }
    /* fetch(url)
      .then((resp) => resp.json())
      .then((resp) => setTableData(resp)); */
  };
  const onChange = (e) => {
    const { value, id } = e.target;
    console.log(value, id);
    if (id.includes("fkLohnartID")) {
      setFormData({ ...formData, fkLohnartID: { [id]: value } });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };
  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };
  const onFirstDataRendered = (params) => {
    setTimeout(function () {
      //params.api.getDisplayedRowAtIndex(4).setExpanded(true);
    }, 0);
  };

  // setting update row data to form data and opening pop up window
  const handleUpdate = (oldData) => {
    setFormData(oldData);
    setOldFormData(oldData);
    handleClickOpen();
  };
  //deleting a user
  const handleDelete = (id) => {
    const confirm = window.confirm(
      "Are you sure, you want to delete this row",
      id
    );
    if (confirm) {
      deleteUsers(id);
    }
  };
  const handleFormSubmit = () => {
    var url = `http://scheffler-hardcore.de:2010/hardcore/dp/DP_T_Mitarbeiter`;
    if (formData.id) {
      //updating a user
      const confirm = window.confirm(
        "Are you sure, you want to update this row ?"
      );

      const data = diff(oldFormData, formData);

      data && confirm && patchUsers(`(${formData.id})`, data);

      handleClose();
    } else {
      // adding new user
      createUser(formData);
      handleClose();
    }
  };

  const defaultColDef = {
    sortable: true,
    flex: 1,
    filter: true,
    floatingFilter: true,
  };
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        id="myGrid"
        style={{
          height: "100%",
          width: "100%",
        }}
        className="ag-theme-alpine"></div>
      <div className="App">
        <h1 align="center">React-App</h1>
        <h3>CRUD Operation with Json-server in ag-Grid</h3>
        <Grid align="right">
          <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Add user
          </Button>
        </Grid>
        <div className="ag-theme-alpine" style={{ height: "400px" }}>
          <AgGridReact
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            masterDetail={true}
            detailCellRendererParams={{
              detailGridOptions: {
                rowSelection: "multiple",
                //suppressRowClickSelection: true,
                enableRangeSelection: true,
                pagination: true,
                paginationAutoPageSize: true,
                columnDefs: [
                  {
                    field: "Stundenlohn",
                  },
                  { field: "Festlohn" },
                  {
                    field: "MaxStunden",
                  },

                  {
                    field: "MaxLohn",
                    minWidth: 150,
                  },
                ],
                defaultColDef: {
                  sortable: true,
                  flex: 1,
                },
              },
              getDetailRowData: function (params) {
                var lohnarray = [];
                lohnarray.push(params.data.fkLohnartID);

                params.successCallback(lohnarray);
                //console.log(lohnarray);
              },
            }}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
            rowData={tableData}
          />
        </div>
      </div>
      <FormDialog
        open={open}
        handleClose={handleClose}
        data={formData}
        onChange={onChange}
        handleFormSubmit={handleFormSubmit}
      />
    </div>
  );
}

export default App;
