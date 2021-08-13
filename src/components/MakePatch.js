import { useEffect } from "react";
import axios from "axios";

const MakePatch = (url, data) => {
  useEffect(() => {
    const patchData = async () => {
      const result = await axios.patch(url, data);
      if (result.status === 200) {
        //setTableData(result.data.value);
        console.log("patched");
      }
    };
    patchData();
  }, []);
};

export default MakePatch;
