import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

// Routes that do not show the navigation drawer
const AUTH_ROUTES = ['/login', '/register'];

// Routes that require authentication (authToken)
const PROTECTED_ROUTES = ['/', '/add', '/saved', '/stories/:id'];

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      const isExpanded = this.#drawerButton.getAttribute('aria-expanded') === 'true';
      this.#drawerButton.setAttribute('aria-expanded', !isExpanded);
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
        this.#drawerButton.setAttribute('aria-expanded', 'false');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
          this.#drawerButton.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  #updateNavVisibility(url) {
    const isAuthPage = AUTH_ROUTES.includes(url);

    this.#navigationDrawer.style.display = isAuthPage ? 'none' : '';
    this.#drawerButton.style.display = isAuthPage ? 'none' : '';
  }

  /**
   * Route guard: checks whether the user is allowed to access the current page.
   * - If not logged in and accessing a protected route -> redirect to #/login
   * - If logged in and accessing an auth route (login/register) -> redirect to #/
   * @returns {boolean} true if redirect occurred (halt render), false if okay to proceed
   */
  #checkAuth(url) {
    const token = localStorage.getItem('authToken');
    const isLoggedIn = !!token;

    if (!isLoggedIn && PROTECTED_ROUTES.includes(url)) {
      window.location.hash = '#/login';
      return true; // Redirect occurred, halt render
    }

    if (isLoggedIn && AUTH_ROUTES.includes(url)) {
      window.location.hash = '#/';
      return true; // Redirect occurred, halt render
    }

    return false;
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    // If page doesn't exist, redirect to home
    if (!page) {
      window.location.hash = '#/';
      return;
    }

    // Run route guard before render
    if (this.#checkAuth(url)) return;

    this.#updateNavVisibility(url);

    const updateDOM = async () => {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
      
      // Manage keyboard focus accessibility on page load
      const heading = this.#content.querySelector('h1, h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
      }
    };

    if (document.startViewTransition) {
      const transition = document.startViewTransition(updateDOM);
      await transition.finished;
    } else {
      await updateDOM();
    }
  }
}

export default App;
