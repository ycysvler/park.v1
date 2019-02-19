import React from 'react';

export default class MapInit extends React.Component {
    constructor(args) {
        super(args);
        this.state = {
        };
    }

    componentDidUpdate(prevProps) {
        this.initialize();
    }

    componentDidMount() {
        this.initialize();
    }

    componentWillUnmount() {
        this.destroy();
    }

    destroy() {
        this.props.map.removeControl(this.control);
        this.control = null;
    }

    initialize() {
        var map = this.props.map;
        if (!map) {
            return;
        }
        map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放

        document.bdmap = map;

    }

    render() {
        return null;
    }
}