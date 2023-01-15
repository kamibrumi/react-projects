import { Fragment } from "react";
import { Outlet, Link } from "react-router-dom";
import { ProjectOutlined } from '@ant-design/icons';
// import "./navigation.styles.scss";

const Navigation = () => {
  return (
    <Fragment>
      <div className="navigation">
        <Link className="logo-container" to={"/"}>
         <ProjectOutlined style={{ fontSize: '50px', color: '#08c' }}/>
        </Link>
        <div className="nav-links-container">
          <Link className="nav-link" to={"/publications"}>
            PUBLICATIONS
          </Link>
        </div>
      </div>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;