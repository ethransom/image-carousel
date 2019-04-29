import React from "react";
import "./App.css";

import Images from "./Images";

export default class App extends React.Component {
  state = {
    images: Images,
    imageIndex: 0,
    transitioning: false,
    targetOpacity: 1
  };

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyPress);
  }

  private onKeyPress = (ev: KeyboardEvent) => {
    if (ev.key === "ArrowLeft") {
      this.switchImage("prev");
    }
    if (ev.key === "ArrowRight") {
      this.switchImage("next");
    }
  };

  private switchImage = async (action: "next" | "prev" | number) => {
    if (this.state.transitioning) {
      return;
    }

    this.setState({
      transitioning: true,
      targetOpacity: 0
    });

    await waitFor(300); // let CSS animate out the old image

    if (action === "next") {
      this.setState({
        imageIndex: (this.state.imageIndex + 1) % this.state.images.length
      });
    }
    if (action === "prev") {
      let i = this.state.imageIndex - 1;
      if (i < 0) {
        i = this.state.images.length - 1;
      }
      this.setState({
        imageIndex: i
      });
    }
    if (typeof action === "number") {
      this.setState({
        imageIndex: action
      });
    }

    // make sure that opacity is set in a different tick than the image source attr
    await waitFor(50);

    this.setState({
      targetOpacity: 1
    });

    await waitFor(300); // let CSS animate in the new image

    this.setState({ transitioning: false });
  };

  render() {
    let img = this.state.images[this.state.imageIndex];

    return (
      <div className="App">
        <header className="App-header">
          <main>
            <button
              onClick={() => this.switchImage("prev")}
              className="control"
            >
              <img src="/img/prev.svg" />
            </button>
            <img
              key={img.src}
              style={{
                opacity: this.state.targetOpacity
              }}
              src={img.src}
              className="carouselImg"
            />
            <button
              onClick={() => this.switchImage("next")}
              className="control"
            >
              <img src="/img/next.svg" />
            </button>
          </main>
          <nav>
            <p
              style={{
                display: "flex",
                flexDirection: "row"
              }}
            >
              {this.state.images.map((img, i) => (
                <img
                  onClick={() => this.switchImage(i)}
                  src={img.src}
                  style={{
                    margin: "0 1vh 0 1vh",
                    width: "3vh",
                    height: "3vh",
                    objectFit: "cover",
                    cursor: "pointer",
                    border:
                      "3px solid " +
                      (i === this.state.imageIndex ? "white" : "black")
                  }}
                />
              ))}
            </p>
            <p>
              Credit:{" "}
              <a className="App-link" href={img.link} target="_blank">
                {img.credit} (flickr)
              </a>
            </p>
          </nav>
        </header>
      </div>
    );
  }
}

function waitFor(millis: number) {
  return new Promise(resolve => {
    setTimeout(resolve, millis);
  });
}
