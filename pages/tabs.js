import React from 'react'
import Layout from '../components/Layout';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
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
            <Typography>{children}</Typography>
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
            value : 0
        }
    }

    handleChange = (event, newValue) => {
        this.setState({
            value : newValue
        })
    };

    render(){
        return(
            <Layout>
                <Tabs value={this.state.value} onChange={this.handleChange} aria-label="simple tabs example">
                    <Tab label="Item 1" {...a11yProps(0)}/>
                    <Tab label="Item 2" {...a11yProps(1)}/>
                    <Tab label="Item 3" {...a11yProps(2)}/>
                </Tabs>
                <TabPanel value={this.state.value} index={0}>
                    Item One
                </TabPanel>
                <TabPanel value={this.state.value} index={1}>
                    Item Two
                </TabPanel>
                <TabPanel value={this.state.value} index={2}>
                    Item Three
                </TabPanel>
            </Layout>
        )
    }
}