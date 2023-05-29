//import useState hook to create menu collapse state
import React, { useState } from "react";
import logo from '../images/gucLogo.png';
import { Link, useNavigate } from 'react-router-dom';
import UseLogout from '../hooks/LogoutHook'

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


const HeaderTA = () => {
    const navigate = useNavigate()
    const { logout, isLoading } = UseLogout()
    const Logout = () => {

        logout()
        navigate('/login')

    }

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
                            <p>{menuCollapse ? "List" : "List"} </p>


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
                                <Link className="link" to="/teacherAssistant">
                                    <div className="hyperlink">Home</div>
                                </Link>
                            </MenuItem>

                            <SubMenu title="Instructor Options" icon={<GiTeacher />}>

                                <MenuItem icon={<FaUser />} className="sub">
                                    <Link className="hyperlink" to="/teacherAssistant/teacherAssistantProfile">
                                        <div className="hyperlink">My Profile</div>
                                    </Link>
                                </MenuItem>

                                <MenuItem icon={<AiOutlineSchedule />} className="sub">
                                    <Link className="link" to="/teacherAssistant/viewAllSchedulesTA">
                                        <div className="hyperlink">View Schedules</div>
                                    </Link>
                                </MenuItem>

                            </SubMenu>

                        </Menu>
                    </SidebarContent>
                    <SidebarFooter>
                        <Menu iconShape="square">
                            <MenuItem onClick={Logout} icon={<FiLogOut />}><div>Logout</div></MenuItem>
                        </Menu>
                    </SidebarFooter>
                </ProSidebar>
            </div>
        </>
    );
};

export default HeaderTA;