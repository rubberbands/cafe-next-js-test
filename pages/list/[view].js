import React from 'react'
import Layout from '../../components/Layout';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button'
import Router from 'next/router';

const useStyles = theme => ({
    table: {
      minWidth: 650,
    },
});

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lists : [],
            view : '',
            data : []
        }
    }

    async componentDidMount(){
        var view = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        this.setState({view : view})
        import('../../xml/' + view + '.xml')
        .then(res => res)
        .then(response => {
            this.setState({
                view : view, 
                lists : response.view.listfields
            })
            this.getData()
            console.log(this.state)
        })
    }

    getData(){
        var column = [];
        for(var i = 0; i < this.state.lists[0].field.length; i++) {
            if(!this.state.lists[0].field[i].listproperties[0].$.computed){
                column.push(this.state.lists[0].field[i].$.name)
            }
        }
        let data = {
            column : column,
            table : this.state.view
        }
        fetch('/api/data', {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
              'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(response => {
            console.log(response)
            this.setState({data : response.data})
        })
    }

    render(){
        return(
            <Layout>
                <br/>
                <Button onClick={() => Router.push('/detail/[view]', '/detail/'+ this.state.view)}>New {this.state.view}</Button>
                <br/>
                {
                    this.state.lists.length != 0 ? (
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        {
                                        this.state.lists[0].field.map(
                                            (list, key) =>
                                                <TableCell key={list.$.name}>{list.label ? (list.label[0].$.name) : (list.$.name)} </TableCell>
                                        )
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        this.state.data.length != 0 ? (
                                            this.state.data.map(
                                                (data, key) =>
                                                    <TableRow key= {data.id}>
                                                        {
                                                            this.state.lists[0].field.map(
                                                                (list) =>
                                                            <TableCell>{data.id}</TableCell>
                                                            )
                                                        }
                                                    </TableRow>
                                            )
                                        ) : (
                                            <TableRow>
                                                <TableCell>No Data</TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <span>Loading...</span>
                    )
                }
            </Layout>
        )
    }
}