import React from 'react'
import Layout from '../components/Layout';
import HomeIcon from "@material-ui/icons/Home";
import ReceiptIcon from "@material-ui/icons/Receipt";
import NotificationsIcon from "@material-ui/icons/Notifications";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import SettingsIcon from "@material-ui/icons/Settings";
import Typography from '@material-ui/core/Typography';
import Sidebar from "../components/Sidebar";

function onClick(e, item) {
    window.alert(JSON.stringify(item, null, 2));
  }
  
//   const items = [
//     { name: "home", label: "Home", Icon: HomeIcon },
//     {
//       name: "billing",
//       label: "Billing",
//       Icon: ReceiptIcon,
//       items: [
//         { name: "statements", label: "Statements", onClick },
//         { name: "reports", label: "Reports", onClick }
//       ]
//     },
//     "divider",
//     {
//       name: "settings",
//       label: "Settings",
//       Icon: SettingsIcon,
//       items: [
//         { name: "profile", label: "Profile" },
//         { name: "insurance", label: "Insurance", onClick },
//         "divider",
//         {
//           name: "notifications",
//           label: "Notifications",
//           Icon: NotificationsIcon,
//           items: [
//             { name: "email", label: "Email", onClick },
//             {
//               name: "desktop",
//               label: "Desktop",
//               Icon: DesktopWindowsIcon,
//               items: [
//                 { name: "schedule", label: "Schedule" },
//                 { name: "frequency", label: "Frequency" }
//               ]
//             },
//             { name: "sms", label: "SMS" }
//           ]
//         }
//       ]
//     }
//   ];

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            views : [],
            data : []
        }
    }

    async componentDidMount(){
        import('../xml/frame.xml')
        .then(res => res)
        .then(response => {
            this.setState({
                views : response.frame.menus[0].menu
            })
            this.setData()
        })
    }

    setData(){
        var menus = []
        var objects = this.state.views
        console.log(this.state.views)
        this.state.views.map(view =>{
            var parentName = ''
            objects.map(object =>{
                object.links[0].link.map(link => {
                    if(link.params[0].param){
                        link.params[0].param.map(param =>{
                            if(param.$.value == view.$.name){
                                parentName = link.$.name
                            }
                        })
                    }
                })
            })
            view.links[0].link.map(link => {
                var paramMenu = false;
                if(link.params[0].param){
                    link.params[0].param.map(param =>{
                        if(param.$.name == "menu"){
                            paramMenu = true
                        }
                    })
                }
                var name = link.$.name
                var label = link.$.name
                if(link.label){
                    label = link.label[0].$.name
                }
                if(view.head){ 
                    if(paramMenu == false){
                        menus.push({
                            name : name,
                            label : label,
                        })
                    } else {
                        menus.push({
                            name : name,
                            label : label,
                            items:[],
                        })
                    }
                } else {
                    if(paramMenu == false){
                        menus.push({
                            name : name,
                            label : label,
                            parent : parentName
                        })
                    } else {
                        menus.push({
                            name : name,
                            label : label,
                            items:[],
                            parent : parentName
                        })
                    }
                }
            })
        })
        console.log(menus)
        var menus2 = menus
        var data = []
        menus.map(menu =>{
            if(menu.items){
                menus2.map(menu2 =>{
                    if(menu2.parent){
                        if(menu2.parent == menu.name)
                        menu.items.push(menu2)
                    }
                })
            }
        })
        menus.map(menu =>{
            if(!menu.parent){
                data.push(menu)
            }
        })
        this.setState({
            data : data
        })
        console.log("data : ")
        data.map(datum => {
            console.log(datum)
        })
    }

    render(){
        var items = this.state.data
        console.log("items : ")
        console.log(items)
        return(
            <Layout>
                {
                    this.state.data.length != 0 ? (
                        <Sidebar items={this.state.data} />
                    ) : (
                        <Typography>Loading...</Typography>
                    )
                }
            </Layout>
        )
    }
}
