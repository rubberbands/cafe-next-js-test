import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'

export default class extends React.Component {
    
    static propTypes() {
        return {
          children: React.PropTypes.object.isRequired,
          fluid: React.PropTypes.boolean
        }
    }

    constructor(props) {
        super(props)
        this.state = {
        }
    }
    
    render() {
        return(
        <React.Fragment>
            <Head>
                <title>Next.js-MySQL</title>
                <meta charSet='utf-8' />
                <meta name='viewport' content='initial-scale=1.0, width=device-width' />
            </Head>
            <div className="app">
                <AppBar position="static">
                    <Toolbar>
                        <Link href={{ pathname: '/' }}><Button>Home</Button></Link>
                    </Toolbar>
                </AppBar>
                { this.props.children }
                <footer>
                    <hr/>
                </footer>
            </div>
        </React.Fragment>
        )  
    }
}