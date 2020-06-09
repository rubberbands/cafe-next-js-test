import React from 'react'
import Layout from '../../components/Layout';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            {children}
          </Box>
        )}
      </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
};

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            details: [],
            view: '',
            tabsxml: [],
            tab: [],
            id: '',
            data: [],
            value: 0
        }
        this.getTabs = this.getTabs.bind(this)
        this.printTab = this.printTab.bind(this)
        this.printTabPanel = this.printTabPanel.bind(this)
    }

    handleChange = (event, newValue) => {
        this.setState({
            value : newValue
        })
    };

    async componentDidMount() {
        var view = window.location.href.substring(window.location.href.indexOf('detail/') + 7, window.location.href.lastIndexOf('/'));
        var id = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
        import('../../xml/masterdata/' + view + '.xml')
            .then(res => res)
            .then(response => {
                this.setState({
                    view: view,
                    id : id,
                    details: response.view.detailviews,
                    tabsxml: response.view.sections[0].section
                })
                this.getViewData()
                this.getTabs()
            })
    }

    getViewData(){
        var column = [];
        for(var i = 0; i < this.state.details[0].detailview[0].field.length; i++) {
            if(!this.state.details[0].detailview[0].field[i].detailproperties[0].$.computed){
                if(this.state.details[0].detailview[0].field[i].$.section == this.state.view){
                    column.push(this.state.details[0].detailview[0].field[i].$.name)
                }
            }
        }
        let data = {
            column : column,
            table : this.state.view,
            id : this.state.id
        }
        fetch('/api/data/' + this.state.id, {
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

    getTabs() {
        console.log(this.state.data)
        var temp = []
        this.state.tabsxml.length != 0 ? (
            this.state.tabsxml.map((tabs, key) => {
                if(key!=0){
                    temp.push(tabs.$.key)
                }
            }),
            this.setState({ tab: temp })
        ) : (
                <Typography>
                    ABC
                </Typography>
            )
    }

    printTab() {
        return <Tabs value={this.state.value} onChange={this.handleChange} aria-label="simple tabs example">
        {
            this.state.tab.length != 0 ? (
                this.state.tab.map((tab, key) => {
                    return <Tab label={tab} {...a11yProps(0)}/>
                })
            ) : (
                <Typography>Loading...</Typography>
            )
        }
        </Tabs>
    }

    printTabPanel() {
        let prevRow
        return <div>{
            this.state.tab.map((tab, key) => {
                return <TabPanel value={this.state.value} index={key}>
                    {
                        this.state.details[0].detailview[0].field.map((field, index, elements) => {
                            if (field.$.section == tab && field.$.section == this.state.view) {
                                this.state.data.map(data => {
                                    prevRow = <TextField label={field.label ? (field.label[0].$.name) : (field.$.name)} defaultValue={(Object.values(data)[index])}/>

                                    if (!field.detailproperties[0].$.visible) {
                                        if (field.detailproperties[0].$.row != elements[index + 1].detailproperties[0].$.row) {

                                            prevRow = <div style={{ display: "inline" }}>
                                                {prevRow}
                                                <br />
                                            </div>
                                        }
                                    } else {
                                        prevRow = <div style={{ display: "none" }}>
                                            {prevRow}
                                        </div>
                                    }
                                })
                                return prevRow
                            }
                        })
                    }
                </TabPanel>
            })
        }</div>
    }

    render() {
        return (
            <Layout>
                {this.printTab()}
                {this.printTabPanel()}
            </Layout>

        )
    }
}