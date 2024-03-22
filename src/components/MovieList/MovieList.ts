import MovieItem from '../MovieItem/MovieItem';
import { Movie } from './../../types/movie';
import '../MovieList/MovieList.css';

interface Props {
  movieList: Movie[];
  isLoading: boolean;
}

class MovieList {
  movieList: Movie[];
  isLoading: boolean;

  constructor({ movieList, isLoading }: Props) {
    this.movieList = movieList;
    this.isLoading = isLoading;
    this.render();
  }

  set newList(movieList: Movie[]) {
    this.movieList = movieList;
  }

  //스켈레톤을 삭제하고 렌더링 하는 방식.
  rerender() {
    const skeletonBox = document.querySelector('#skeleton-box');
    if (!skeletonBox) return;
    skeletonBox.remove();
    this.render();
  }

  render() {
    if (!this.movieList.length) return this.renderSkeleton();
    return this.renderMovieList();
  }

  renderSkeleton() {
    const skeletonBox = document.createElement('div');
    skeletonBox.classList.add('item-list');
    skeletonBox.id = 'skeleton-box';

    Array.from({ length: 20 }).forEach(() => {
      const moveItemTemplate = MovieItem.skeletonTemplate();
      skeletonBox.append(moveItemTemplate);
    });

    const movieListBox = document.querySelector('.item-list');
    if (!movieListBox) return;
    movieListBox.append(skeletonBox);

    const parent = document.querySelector('.item-view');
    if (!parent) return;
    parent.append(movieListBox);
  }

  renderMovieList() {
    const fragment = new DocumentFragment();
    this.movieList!.forEach(movie => {
      const moveItemTemplate = MovieItem.template(movie);
      fragment.append(moveItemTemplate);
    });

    const movieListBox = document.querySelector('.item-list');
    if (!movieListBox) return;
    movieListBox.append(fragment);

    const parent = document.querySelector('.item-view');
    if (!parent) return;
    parent.append(movieListBox);
  }
}

export default MovieList;
