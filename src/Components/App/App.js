import React, { Component } from 'react';
import AllComicsDisplay from '../AllComicsDisplay/AllComicsDisplay';
import NavBar from '../NavBar/NavBar'
import SingleComic from '../SingleComic/SingleComic';
import FeaturedComic from '../FeaturedComic/FeaturedComic'
import { fetchAllComics } from '../../Utils/APICalls';
import { Switch, Route } from 'react-router-dom';
import './App.css';

class App extends Component {
  constructor() {
    super()
      this.state = {
        allComics: [],
        featuredComic: [],
        readingList: [],
        error: ''
      }
  }

  componentDidMount = () => {
    fetchAllComics()
      .then(comicsData => {
        (typeof comicsData === 'string') ?
          this.setState({ error: comicsData }) :
          this.setState({ allComics: comicsData.results.books,
                          featuredComic: comicsData.results.books[0] })
      })
      .catch(err => this.setState({ error: 'Something went wrong. Please try again later.'} ))
  }

  render() {
    return (
      <main className="App">
        <NavBar />
        <Route exact path ='/'
          render={() => (
            <div className='main-container'>
              <AllComicsDisplay comicsData={this.state.allComics} addToList={this.addComicToReadingList}/>
              <FeaturedComic featuredComic={this.state.featuredComic}/>
            </div>
          )}
        />
        <Route exact path ='/reading-list'
          render={() => (
            !this.state.readingList.length ? <h1>Sorry no comics in reading list</h1>
            : <div>
                <h1>Reading List</h1>
                <AllComicsDisplay comicsData={this.state.readingList}/>
              </div>
          )}
        />
      </main>
    )
  }

  addComicToReadingList = (event) => {
     const readingList = this.state.readingList
     const comicToAdd = this.state.allComics.find( comic => comic.rank === parseInt(event.target.id))
     if (!readingList.includes(comicToAdd)) {
      this.setState({readingList: [...readingList, comicToAdd]})
   }
  }
}

export default App;
