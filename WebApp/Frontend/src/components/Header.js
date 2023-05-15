//import useState hook to create menu collapse state
import React, { useState } from "react";
import logo from '../images/gucLogo.png';

//import react pro sidebar components
import {
    ProSidebar,
    Menu,
    MenuItem,
    SubMenu,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
} from "react-pro-sidebar";

//import icons from react icons
import { FaList, FaRegHeart, FaUser } from "react-icons/fa";
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { RiPencilLine } from "react-icons/ri";
import { BiCog } from "react-icons/bi";
import { GrUserAdmin } from "react-icons/gr";
import { GiTeacher } from "react-icons/gi";
import { MdEditCalendar } from "react-icons/md";
import { AiOutlineSchedule } from "react-icons/ai";
import { ImNewspaper } from "react-icons/im";


//import sidebar css from react-pro-sidebar module and our custom css 
import "react-pro-sidebar/dist/css/styles.css";
import "./Header.css";


const Header = () => {

    //create initial menuCollapse state using useState hook
    const [menuCollapse, setMenuCollapse] = useState(false)

    //create a custom function that will change menucollapse state from false to true and true to false
    const menuIconClick = () => {
        //condition checking to change state from true to false and vice versa
        menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
    };



    return (
        <>
            <div id="header">
                {/* collapsed props to change menu size using menucollapse state */}
                <ProSidebar collapsed={menuCollapse} >
                    <SidebarHeader >
                        <div className="logotext">
                            {/* small and big change using menucollapse state */}
                            <p>{menuCollapse ? "Logo" : "logo"} </p>


                        </div>
                        <div className="closemenu" onClick={menuIconClick}>
                            {/* changing menu collapse icon on click */}
                            {menuCollapse ? (
                                <FiArrowRightCircle />
                            ) : (
                                <FiArrowLeftCircle />
                            )}
                        </div>
                    </SidebarHeader >
                    <SidebarContent >
                        <Menu iconShape="square" >
                            <MenuItem active={true} icon={<FiHome />}>
                                Home
                            </MenuItem>
                            <SubMenu title="Manage Schedules" icon={<FaList />}>
                                <MenuItem icon={<MdEditCalendar />} className="sub">Assign TAs</MenuItem>
                                <MenuItem icon={<AiOutlineSchedule />} className="sub">View Schedules</MenuItem>
                            </SubMenu>
                            <SubMenu title="Manage Users" icon={<FaUser />}>
                                <MenuItem icon={<GrUserAdmin />} className="sub">Admins</MenuItem>
                                <MenuItem icon={<GiTeacher />} className="sub">TAs</MenuItem>
                            </SubMenu>
                            <MenuItem icon={<ImNewspaper />}>Manage Courses</MenuItem>
                        </Menu>
                    </SidebarContent>
                    <SidebarFooter>
                        <Menu iconShape="square">
                            <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
                        </Menu>
                    </SidebarFooter>
                </ProSidebar>
            </div>
        </>
    );
};

export default Header;