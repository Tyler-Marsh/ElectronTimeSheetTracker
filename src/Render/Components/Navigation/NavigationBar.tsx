import React, { ReactElement } from 'react';
import MainNavLink from './MainNavLink';
import {useLocation} from 'react-router-dom';

export default function NavigationBar() : ReactElement {

    const location= useLocation();
    console.log("location: "+ location.pathname);
    console.log("hash: "+location.hash);

    const lastPathName = location.pathname.split('/');
    const pathName = lastPathName[lastPathName.length -1]
    // /main/employee

    console.log(
        "last path anem:" + lastPathName
    )
    // /addremove

    // /summary

    // /settings
    return (

        <div className={["card","navGrid"].join(" ")} >
               <MainNavLink  Name={"Work spaces"} Underline={false}     To={"/"} HoverMessage={"Manage Workspaces"}></MainNavLink>
               <MainNavLink  Name={"Employee"}   Underline={pathName === 'employee'}     To={"/main/employee"} HoverMessage={"View a single employee"} ></MainNavLink>
               <MainNavLink  Name={"Add/Remove"}  Underline={pathName ==='addremove'}    To={"/addremove"} HoverMessage={"Edit employees/deparments"}></MainNavLink>
               <MainNavLink  Name={"Reports"}     Underline={pathName ==='summary'}    To={"/summary"} HoverMessage={"View reports"}></MainNavLink>
               <MainNavLink  Name={"Settings"}    Underline={pathName ==='settings'}    To={"/settings"} HoverMessage={"Edit configuration settings"}></MainNavLink>
            </div>
    )
}