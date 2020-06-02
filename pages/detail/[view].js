import React from 'react'
import Layout from '../../components/Layout';
import TextField from '@material-ui/core/TextField';

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            details : [],
            view : ''
        }
    }

    async componentDidMount(){
        var view = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        import('../../xml/' + view + '.xml')
        .then(res => res)
        .then(response => {
            this.setState({
                view: view, 
                details : response.view.detailviews
            })
        })
    }
    
    render(){
        return(
            <Layout>
                <form>
                    {console.log(this.state)}
                {
                    this.state.details.length != 0 ? (
                        this.state.details[0].detailview[0].field.map(
                            (detail, key) =>
                                detail.$.section == this.state.view ? (
                                    <TextField label={
                                        detail.label ? (detail.label[0].$.name) : (detail.$.name)
                                    }/>
                                ) : (
                                    <span></span>
                                )
                                
                        )
                    ) : (
                        <span>Loading...</span>
                    )
                }
                </form>
            </Layout>
        )
    }
}