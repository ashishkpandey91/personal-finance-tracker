import { useAppSelector } from "@/store/hook";
import { ProtectedProps } from "@/type/index";
import { ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Protected({
  children,
  authentication = true,
}: ProtectedProps): ReactElement {
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  const authStatus = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    if (!authentication && authStatus !== authentication) {
      navigate("/login");
    } else if (authentication && authStatus !== authentication) {
      navigate("/");
    }
    setLoader(false);
  }, [navigate, authStatus, authentication]);

  return loader ? <h1>Loading...</h1> : <>{children}</>;
}

export default Protected;
