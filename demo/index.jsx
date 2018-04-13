import React, { PureComponent } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import ReactInstagramFeed from '../src';

const root = document.getElementById('root');

const Frame = styled.div`
  display: inline-block;
  position: relative;
  float: left;
  padding: 25% 0 0;
  width: 25%;
  height: 0;
  overflow: hidden;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }

  &:hover {
    blockquote {
      opacity: 1;
    }
  }

  img {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    width: 100%;
    height: auto;
    z-index: 1;
  }

  blockquote {
    position: absolute;
    bottom: 0;
    margin: 0;
    width: 100%;
    color: #111;
    background-color: #fff;
    z-index: 3;
    opacity: .3;
  }

  .igf-like,
  .igf-comment {
    position: absolute;
    padding: 0 4px;
    line-height: 1em;
    color: #111 !important;
    background-color: #fff;
    font-size: 12px;
    text-decoration: blink;
    z-index: 5;
  }

  .igf-like {
    top: 0;
  }

  .igf-comment {
    top: 1em;
  }
`;

const Clearfix = styled.div`
  &:before,
  &:after {
    display: block;
    content: '';
    clear: both;
  }
`;

const Wrapper = ({
  children,
}) => (
  <Frame>
    {children}
  </Frame>
);

class App extends PureComponent {
  state = {
    forceNext: null,
  };

  updateForceNext = () => {
    this.setState({
      forceNext: Date.now(),
    });
  };

  render() {
    return (
      <div>
        <ReactInstagramFeed
          accessToken="7033819444.3598385.338046e1f1634dc58697dc8b5d91425a"
          count={4}
          type="user"
          param="self"
          resolution="thumbnail"
          wrapper={Wrapper}
          hasLink
          buttonText="Fetch (from inside of ReactInstagramFeed component)"
          before={() => { console.log('Before fetching feeds'); }}
          after={() => { console.log('After fetching feeds'); }}
          forceNext={this.state.forceNext}
        />
        <Clearfix />
        <button onClick={this.updateForceNext}>
          Fetch (from outside of ReactInstagramFeed component)
        </button>
      </div>
    );
  }
}

render(
  <App />,
  root
);
