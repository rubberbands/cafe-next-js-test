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
import Link from 'next/link'

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
}))(TableCell);
  
const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
}))(TableRow);

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
        import('../../xml/masterdata/' + view + '.xml')
        .then(res => res)
        .then(response => {
            this.setState({
                view : view, 
                lists : response.view.listfields
            })
            this.getData()
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
            this.setState({data : response.data})
            console.log(this.state.data)
        })
    }

    generateData(){

    }

    render(){
        var i
        return(
            <Layout>
                {/* <br/> */}
                {/* <Button onClick={() => Router.push('/detail/[view]', '/detail/'+ this.state.view)}>New {this.state.view}</Button> */}
                <br/>
                {
                    this.state.lists.length != 0 ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {
                                        this.state.lists[0].field.map(
                                            (list, key) =>
                                                <StyledTableCell key={list.$.name}>{list.label ? (list.label[0].$.name) : (list.$.name)} </StyledTableCell>
                                        )
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        this.state.data.length != 0 ? (
                                            this.state.data.map((data, key) =>
                                                <StyledTableRow key={key}>
                                                    {
                                                        this.state.lists[0].field.map((list, key) =>
                                                            list.listproperties[0].$.indexfield ? (
                                                                <StyledTableCell><Link href="/detail/[...view]"
                                                                as={`/detail/${this.state.view}/${Object.values(data)[0]}`}>{Object.values(data)[key]}</Link></StyledTableCell>
                                                            ) : (
                                                                <StyledTableCell>{Object.values(data)[key]}</StyledTableCell>
                                                            )
                                                        )
                                                    }
                                                </StyledTableRow>
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