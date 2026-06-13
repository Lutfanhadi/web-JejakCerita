import HomePage from '../pages/home/home-page';
import LoginPage from '../pages/login';
import RegisterPage from '../pages/register';
import AddStoryPage from '../pages/add';
import DetailPage from '../pages/detail';
import SavedPage from '../pages/saved';

const routes = {
  '/': new HomePage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
  '/add': new AddStoryPage(),
  '/stories/:id': new DetailPage(),
  '/saved': new SavedPage(),
};

export default routes;
