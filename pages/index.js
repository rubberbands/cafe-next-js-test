import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import Router from 'next/router';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Sidebar from "../components/Sidebar";

export default class extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            views : [],
            data : [],
            url : []
        }
    }

    async componentDidMount() {
        import('../xml/frame.xml')
        .then(res => res)
        .then(response => {
            this.setState({
                views : response.frame.menus[0].menu,
                url : response.frame.usedviews[0].view
            })
            this.setData()
        })
    }

    setData(){
        var menus = []
        
        var objects = this.state.views
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
                var url = ''
                var paramMenu = false;
                if(link.params[0].param){
                    link.params[0].param.map(param =>{
                        if(param.$.name == "menu"){
                            paramMenu = true
                        }
                        if(param.$.name == "view"){
                            this.state.url.map(urlValue =>{
                                if(urlValue.$.name == param.$.value){
                                    url = urlValue.$.url
                                }
                            })
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
                            url : url
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
                            url : url,
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
        console.log(this.state.data)
    }

    render() {
        
        return(
            <Layout {...this.props}>
                <br/>
                <Card style={{maxWidth: 275}}>
                    <CardContent>
                        <Typography variant="h6" component="h2">
                            Main Menu
                        </Typography>
                        <hr/>
                        {
                            this.state.data.length != 0 ? (
                                <Sidebar items={this.state.data} />
                            ) : (
                                <Typography>Loading...</Typography>
                            )
                        }
                    </CardContent>
                </Card>
            </Layout>
        )
    }
}