import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../components/Layout';
import Router from 'next/router';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });
export default class extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            views : []
        }
        this.handleDelete = this.handleDelete.bind(this)
        console.log(this.state)
    }

    async componentDidMount() {
        this.getViews()
    }

    getViews(){
        fetch('/api/views')
        .then(res => res.json())
        .then(response => {
          this.setState({views : response.views})
        })
    }

    async handleDelete(e) {
        e.preventDefault()
        var id = e.target.value
        fetch('/api/delete/' + id)
        .then(async res => {
            if (res.status === 200) {
              this.getEmployees()
            } else {
                res.json()
            }
          })

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
                    this.state.views.length != 0 ? 
                    (this.state.views.map(
                        (view, key) => 
                            <Typography key={key} onClick={() => Router.push('/list/[view]', '/list/'+ view)}>
                                {view} 
                            </Typography>
                    )) : (
                        <span>none</span>
                    )
                }
                    </CardContent>
                </Card>
            </Layout>
        )
    }
}