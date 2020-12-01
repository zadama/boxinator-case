import { useEffect } from "react";

const useTest = () => {
  useEffect(() => {
    console.log("In useTEST USEFFECt");
    return () => {
      console.log("UNMOUnting in useTest");
    };
  }, []);

  return "Use test returns";
};

export default useTest;
