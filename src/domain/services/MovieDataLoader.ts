import MovieList from '../../components/MovieList/MovieList';
import MoreButton from '../../components/MoreButton/MoreButton';
import movieAPI from '../../api/movie';
import { getEndpoint, getUrlParams, setUrlParams } from '../../utils/queryString';
import MovieDomain from '../entity/Movie';
import { END_POINT, QUERY_STRING_KEYS } from '../../consts/URL';

class MovieDataLoader {
  currentPage: number = 1;
  totalPage: number = 1;
  itemViewBox = document.querySelector('.item-view');
  movieListBox = document.createElement('ul');
  movieList: MovieList;
  query?: string;
  renderComplete: boolean;

  constructor() {
    this.movieList = new MovieList({ isLoading: true, movieList: [] });
    this.currentPage = Number(getUrlParams(QUERY_STRING_KEYS.PAGE));
    this.query = getUrlParams(QUERY_STRING_KEYS.QUERY) ?? undefined;
    this.renderComplete = false;
    this.observePage();
  }

  observePage() {
    window.addEventListener('scroll', async () => {
      console.log('scroll');
      const isScrollEnded = window.innerHeight + window.scrollY + 100 >= document.body.offsetHeight;

      if (isScrollEnded && this.currentPage < this.totalPage) {
        this.currentPage += 1;
        await this.renderTargetPage();
      }
    });
  }

  async renderTargetPage() {
    this.movieList.renderSkeleton();

    setUrlParams(QUERY_STRING_KEYS.PAGE, String(this.currentPage));

    const movieResult = await this.selectAPIAndFetch();
    const formattedMovieList = new MovieDomain(movieResult).formatMovieList();

    this.totalPage = movieResult.total_pages;
    this.movieList.newList = formattedMovieList;
    this.movieList.render();
  }

  async renderFirstPage() {
    this.removeExistedData();

    this.movieList.renderSkeleton();
    this.currentPage = 1;
    setUrlParams(QUERY_STRING_KEYS.PAGE, String(this.currentPage));

    const movieResult = await this.selectAPIAndFetch();
    const formattedMovieList = new MovieDomain(movieResult).formatMovieList();

    this.totalPage = movieResult.total_pages;
    this.movieList.newList = formattedMovieList;
    this.movieList.render();

    if (this.totalPage === 1) return;
    this.renderComplete = false;
  }

  removeExistedData() {
    MoreButton.removeExistedButton();

    const notFoundBox = document.querySelector('#not-found');
    if (notFoundBox) {
      notFoundBox.remove();
    }

    const itemList = document.querySelector('.item-list');
    if (!itemList) return;
    itemList.replaceChildren();

    this.resetSearchInput();
  }

  resetSearchInput() {
    const endpoint = getEndpoint();
    if (endpoint !== END_POINT.SEARCH) {
      const searchInput = document.querySelector('.search-box input') as HTMLInputElement;
      if (!searchInput) return;
      searchInput.value = '';
    }
  }

  async showNextPage() {
    MoreButton.removeExistedButton();
    this.currentPage++;
    setUrlParams(QUERY_STRING_KEYS.PAGE, String(this.currentPage));

    this.movieList.renderSkeleton();

    const movieResult = await this.selectAPIAndFetch();
    const popularMovieList = new MovieDomain(movieResult).formatMovieList();

    this.movieList.newList = popularMovieList;
    this.movieList.render();
  }

  async selectAPIAndFetch() {
    const endpoint = getEndpoint();
    const query = getUrlParams(QUERY_STRING_KEYS.QUERY);
    if (endpoint === END_POINT.SEARCH && query) {
      return movieAPI.fetchSearchMovies({ pageNumber: this.currentPage, query });
    }
    return movieAPI.fetchPopularMovies({ pageNumber: this.currentPage });
  }
}

export default MovieDataLoader;
