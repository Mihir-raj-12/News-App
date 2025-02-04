import React, { Component } from "react";
import NewsItems from "./NewsItems";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from 'react-infinite-scroll-component';

export class News extends Component {
  static defaultProps = {
    country: "us",
    pageSize: 8,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  capitalizeFirstLetter=(string)=> {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

  constructor(props) {
    super(props);
    console.log("hello i am component from news component");
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResult : 0,
    };
    document.title =` ${this.capitalizeFirstLetter(this.props.category)} - NewsApp`;
  }

  async updateNews(){
    this.props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=4bf80bfee58047cd888b1c666a26a382&page=${this.state.page}&pagesize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    this.props.setProgress(30);
    let parsedData = await data.json(); 
    this.props.setProgress(70);
    this.setState({
      articles:parsedData.articles,
      totalResults: parsedData.totalResults,
      loading: false,
    });
    this.props.setProgress(100);

    
  }

  async componentDidMount() {
   this.updateNews();
  }

  handlePrevClick = async () => {
    this.setState({page : this.state.page - 1}) ;
    this.updateNews ();
  };

  handleNextClick = async () => {
    this.setState({page : this.state.page + 1}) ;
    this.updateNews ();
  };

  
  fetchMoreData = async () => {
    this.setState({page : this.state.page + 1}) ;
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=4bf80bfee58047cd888b1c666a26a382&page=${this.state.page}&pagesize=${this.props.pageSize}`;
    this.setState({ loading: true });
    let data = await fetch(url);
    let parsedData = await data.json(); 
    this.setState({
      articles:this.state.articles.concat(parsedData.articles),
      totalResults: parsedData.totalResults,
      loading : false,

    });
  };


  render() {
    return (
      <>
        <h1 className="text-center" style={{ margin: " 30px 0px" }}>
         NewsApp-Top {this.capitalizeFirstLetter(this.props.category)} Headlines
        </h1>
        {this.state.loading && <Spinner />}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResult}
          loader={this.state.loading && <Spinner/>}
        >
        <div className="container">
        <div className="row">
          {this.state.articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItems
                    title={element.title ? element.title : ""}
                    description={element.description ? element.description : ""}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source = {element.source.name}
                  />
                </div>
              
              );
            })}
        </div>
        </div>
        </InfiniteScroll>

      </>
    );
  }
}

export default News;
