import { Component } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ThreeDots } from 'react-loader-spinner';
import { SearchForm } from 'components/SearchForm/SearchForm';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Wrapper } from './App.styled';
import { getImageByQuery } from 'components/services/api';
import { ButtonLoadMore } from 'components/Button/Button';
import { Modal } from 'components/Modal/Modal';

export class App extends Component {
  state = {
    searchQuery: '',
    images: [],
    isLoading: false,
    page: 1,
    largeImageSrc: '',
  };

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery, page } = this.state;

    if (prevState.searchQuery !== searchQuery || prevState.page !== page) {
      this.onSearch();
    }
  }

  handleSearchFormSubmit = ({ inputValue }) => {
    if (inputValue === this.state.searchQuery) {
      return
    }
    
    this.setState({
      searchQuery: inputValue,
      images: [],
      page: 1,
    });
  };

  onSearch = async () => {
    try {
      const { searchQuery, page } = this.state;

      this.setState({ isLoading: true });
      const data = await getImageByQuery(searchQuery, page);
      const { hits } = data;
      if (hits.length === 0) {
        toast.error(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      this.setState(state => ({
        images: [...this.state.images, ...hits],
        isLoading: false,
      }));
    } catch (error) {
      toast.error('Something went wrong. Try again.');
    }
  };

  loadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  onOpenModal = e => {
    this.setState({ largeImageSrc: e.target.dataset.sourse });
  };

  onCloseModal = e => {
    this.setState({ largeImageSrc: '' });
  };

  render() {
    const { images, isLoading, largeImageSrc } = this.state;

    return (
      <Wrapper>
        <SearchForm onSubmit={this.handleSearchFormSubmit} />
        <ImageGallery
          images={images}
          onOpenModal={this.onOpenModal}
        ></ImageGallery>
        {isLoading && (
          <ThreeDots color="red" wrapperStyle={{ margin: 'auto' }} />
        )}
        {images.length >= 12 && <ButtonLoadMore loadMore={this.loadMore} />}
        {largeImageSrc.length > 0 && (
          <Modal
            largeImageURL={largeImageSrc}
            onCloseModal={this.onCloseModal}
          />
        )}

        <Toaster
          position="top-right"
          toastOptions={{
            error: {
              duration: 3000,
              style: {
                border: '2px solid red',
              },
            },
          }}
        />
      </Wrapper>
    );
  }
}
