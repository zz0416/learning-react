import 'normalize.css';
import React from 'react';
import ReactART from 'react-art';
import Rectangle from 'react-art/lib/Rectangle.art';
import d3 from 'd3';
const Group = ReactART.Group;
const ARTText = ReactART.Text;
const Shape = ReactART.Shape;
const Surface = ReactART.Surface;
import ReactDOM from 'react-dom';
const monthText = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
  'Oct', 'Nov', 'Dec'];
const monthScale = d3.scale.linear().domain([0, 12]).range([0, 400 - 20]);
const valueScale = d3.scale.linear().domain([0, 10]).range([{
  color: '#add8e6',
  height: 0,
}, {
  color: '#4169e1',
  height: 400,
}]);

function onMouseMove(d, e) {
  this.setState({
    tip: {
      content: `${monthText[d.month]} : ${d.value}`,
      x: e.pageX,
      y: e.pageY,
    },
  });
  console.log('mousemove ', d, e.pageX, e.pageY);
}

function onMouseOut() {
  this.setState({
    tip: null,
  });
}

const Component = React.createClass({
  propTypes: {
    data: React.PropTypes.arrayOf(React.PropTypes.shape({
      month: React.PropTypes.number,
      value: React.PropTypes.number,
    })),
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
    const rootNode = ReactDOM.findDOMNode(this);
    this.rootOffset = rootNode.getBoundingClientRect();
  },

  componentDidUpdate() {
    this.componentDidMount();
  },

  getRects() {
    return this.props.data.map((d) => {
      var mouseMove = onMouseMove.bind(this, d);
      var mouseOut = onMouseOut.bind(this);
      const value = valueScale(d.value);
      const height = value.height;
      const y = 400 - height;
      const x = monthScale(d.month);
      return (<Rectangle
        key={value}
        width={10}
        height={height}
        x={x}
        y={y}
        onMouseOut={mouseOut}
        onMouseMove={mouseMove}
        fill={value.color}
        key={d.month}
      />);
    });
  },

  getTip() {
    const tip = this.state.tip;
    if (!tip) {
      return null;
    }
    return (
      <div
        style={{
          position: 'absolute',
          border: '1px solid red',
          left: tip.x - this.rootOffset.left + 10,
          top: tip.y - this.rootOffset.top,
        }}
      >
        {tip.content}
      </div>);
  },

  getXAxis() {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      const value = monthScale(i) - 5;
      months.push((
        <Group
          x={value}
          key={value}
          y={400}
        >
          <ARTText stroke="#000" font={{ fontSize: 10 }}>{monthText[i]}</ARTText>
        </Group>));
    }
    return (<Group x={20}>
      <Shape d="M0,400 L400,400 Z M400,400" stroke="#000" strokeWidth={2}/>{months}
    </Group>);
  },

  getYAxis() {
    const values = [];
    for (let i = 1; i <= 10; i++) {
      const value = valueScale(i);
      const height = value.height;
      const y = 400 - height;
      values.push(<Group y={y} key={y}>
        <ARTText stroke="#000" font={{ fontSize: 20 }}>{i}</ARTText>
        <Shape d="M0,0 L20,0 Z M20,0" stroke="#000"/>
      </Group>);
    }
    return (<Group>
      <Shape d="M20,0 L20,400 Z M20,400" stroke="#000" strokeWidth={2}/>{values}
    </Group>);
  },

  render() {
    const tip = this.getTip();

    return (<div style={{ width: 500, height: 420, position: 'relative' }}>
      {tip}
      <Surface width={500} height={420}>
        {this.getYAxis()}
        {this.getXAxis()}
        <Group x={20} y={0} width={400} height={400}>
          {this.getRects()}
        </Group>
      </Surface>
    </div>);
  },
});

const data = [];

for (let i = 1; i < 13; i++) {
  data.push({
    month: i,
    value: Math.floor(Math.random() * 10) + 1,
  });
}

console.log('data', data);
ReactDOM.render(<div style={{ width: 500, margin: 'auto' }}>
  <Component data={data}/>
</div>, document.getElementById('__react-content'));
