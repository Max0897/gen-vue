import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 120,
  easing: 'ease',
  speed: 400,
});

export default NProgress;
