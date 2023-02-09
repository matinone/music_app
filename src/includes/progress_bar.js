import NProgress from "nprogress";

export default (router) => {
  router.beforeEach((to, from) => {
    NProgress.start();
  });

  router.afterEach(NProgress.done);
};
