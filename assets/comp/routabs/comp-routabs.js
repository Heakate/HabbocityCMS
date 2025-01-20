import {CompLoader} from "../loader/comp-loader.js";

export class CompRoutabs {

    container = null;
    renderingContainer = null;
    routes = [];
    centerLoader = false;
    currentRoute = null;

    static routers = [];

    constructor(container, renderingContainer, routes, centerLoader = false, centerSubCategory = false) {
        this.container = container;
        this.renderingContainer = renderingContainer;
        routes.forEach(route => this.addRoute(route));
        this.centerLoader = centerLoader;

        let firstRoute = this.routes[0];
        if (firstRoute) {
            this.renderTab(firstRoute);
        }
    }

    addRoute(route) {
        let button = this.container.find(route.selector);
        let newRoute = {selector: button, module: route.module};
        button.click(() => {
            this.routes.forEach(route => {
                route.selector.removeAttr("selected");
            });

            this.renderTab(newRoute);
        });

        this.routes.push(newRoute);

        return newRoute;
    }

    removeRoute(route) {
        let newRoute = this.routes.find(value => value.module === route.module);
        if (newRoute) {
            this.routes.splice(this.routes.indexOf(newRoute), 1);
            if (this.currentRoute === newRoute && this.routes.length > 0) {
                this.renderTab(this.routes[0]);
            }
        }
    }

    renderTab(route) {
        this.currentRoute = route;

        this.renderingContainer.empty();
        CompLoader.render(this.renderingContainer, this.centerLoader);
        route.selector.attr("selected", "true");
        $.ajax({
            type: "GET",
            url: route.module,
            success: (data) => {
                this.renderingContainer.css({top: "100px", opacity: 0, transition: "0s"});
                this.renderingContainer.append(data);
                $('.CompLoader').css('display', 'none');
                setTimeout(() => {
                    CompLoader.remove(this.renderingContainer);
                    this.renderingContainer.animate({top: "0px", opacity: 1}, {duration: 230});
                    this.onTabRender();
                }, 50);
            }
        });
    }

    reloadRoute() {
        this.renderTab(this.currentRoute);
    }

    onTabRender() {

    }

    static globalId(id, router) {
        this.routers.push({id: id, router: router});
    }

    static globalReload(id) {
        this.routers.forEach(data => {
            if (data.id === id) {
                data.router.reloadRoute();
            }
        })
    }
}