import React, { Component } from 'react';
import shortid from 'shortid';
import Utils from '../../../util';
import CircularProgress from 'material-ui/CircularProgress';
import Chart from 'chart.js';

class LineChartSingle extends Component {

    _canvasID;
    _ctx;
    _lineChart;
    _labels = [];

    constructor(props) {
        super(props);
        this._canvasID = shortid.generate();
        this.state = { showProgress: true };
    }

    setLabels(labels) {
        this._labels = labels;
        return this;
    }

    createGradient(fromColor, alphaOptions = false) {
        let a1 = '0.500';
        let a2 = '0.100';
        if (alphaOptions && alphaOptions.a1 && alphaOptions.a2) {
            a1 = alphaOptions.a1; a2 = alphaOptions.a2;
        }
        let gradient = this._ctx.createLinearGradient(150.000, 0.000, 150.000, 500.000);
        const grdientOneTopColor = Utils.convertHexToRGB(fromColor);
        const grdientOneBottomColor = Utils.convertHexToRGB(fromColor);
        gradient.addColorStop(0.000, `rgba(${grdientOneTopColor.r}, ${grdientOneTopColor.g}, ${grdientOneTopColor.b}, ${a1})`);
        gradient.addColorStop(1.000, `rgba(${grdientOneBottomColor.r}, ${grdientOneBottomColor.g}, ${grdientOneBottomColor.b}, ${a2})`);  
        return gradient;
    }

    // draw new cart
    drawChart(feedDataSets) {
        this.destroy();
        this.setState({showProgress: false});
        this._lineChart = new Chart(this._ctx, {
            type: 'line',
            data: {
                datasets: feedDataSets,
                labels: this._labels
            },
            options: {               
                scales: {
                    yAxes: [{
                        type: 'linear',
                        position: 'left',
                    }]
                },
                tooltips: {
                    mode: 'point',
                    callbacks: {
                        label: (tooltipItems, data) => { 
                            let num = parseFloat(tooltipItems.yLabel);
                            return ` $${num.formatMoney(2, 3, '.', ',')}`;
                        }
                    }                    
                },
                legend: {
                    labels: {
                        fontStyle: "'Roboto', sans-serif"
                    }
                }         
            }
        });        
    }

    componentDidMount() {
        this._ctx = document.getElementById(this._canvasID).getContext('2d');
        Chart.defaults.global.responsive = true;
    }

    _renderProgress() {
        if (this.state.showProgress && this.props.hideProgress !== true) {
            return <div className="progress"><CircularProgress color='#9167fa' /></div>;
        }
    }

    render() {
        return(
            <div className="linear-chart" style={{position: 'relative'}}>
                { this._renderProgress() }
                <canvas id={this._canvasID}></canvas>
            </div>             
        )
    }

    getChart() {
        return this._lineChart;
    }

    destroy() {
        if (this._lineChart) {
            try {
                this._lineChart.destroy()
            } catch (e) {}
        }
        this.setState({showProgress: true});        
    }
}

export default LineChartSingle;
