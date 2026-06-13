import DbHelper from '../db/db-helper';

class SavedPresenter {
  constructor({ view }) {
    this._view = view;
    this._stories = [];
    this._filteredStories = [];
  }

  async init() {
    await this._fetchSavedStories();
    this._bindEvents();
  }

  async _fetchSavedStories() {
    try {
      this._stories = await DbHelper.getSavedStories();
      this._applyFilterAndSort();
    } catch (error) {
      console.error('Error loading saved stories from IndexedDB:', error);
      this._stories = [];
      this._view.renderSavedStories([]);
    }
  }

  _bindEvents() {
    const searchInput = document.getElementById('saved-search-input');
    const sortSelect = document.getElementById('saved-sort-select');
    const listEl = document.getElementById('saved-stories-list');

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this._applyFilterAndSort();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        this._applyFilterAndSort();
      });
    }

    if (listEl) {
      listEl.addEventListener('click', (e) => {
        const card = e.target.closest('.story-card');
        if (card) {
          const id = card.getAttribute('data-id');
          window.location.hash = `#/stories/${id}`;
        }
      });

      // Keyboard navigation (Enter key)
      listEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const card = e.target.closest('.story-card');
          if (card) {
            const id = card.getAttribute('data-id');
            window.location.hash = `#/stories/${id}`;
          }
        }
      });
    }
  }

  _applyFilterAndSort() {
    const searchInput = document.getElementById('saved-search-input');
    const sortSelect = document.getElementById('saved-sort-select');

    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const sortOrder = sortSelect ? sortSelect.value : 'newest';

    // 1. Search filter (by name or description)
    this._filteredStories = this._stories.filter(story => {
      const matchName = story.name.toLowerCase().includes(query);
      const matchDesc = story.description.toLowerCase().includes(query);
      return matchName || matchDesc;
    });

    // 2. Sort order
    this._filteredStories.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      if (sortOrder === 'newest') {
        return dateB - dateA; // descending
      } else {
        return dateA - dateB; // ascending
      }
    });

    // Render results
    this._view.renderSavedStories(this._filteredStories);
  }
}

export default SavedPresenter;
