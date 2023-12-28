import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const customTheme = {
    colors: {
        coffee: "#4d3933",
        chocolate: "#7d5f59",
        milk: "#f9f6f0",
        cream: "#e7d7cf",
    },
};

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: "customTheme",
        themes: { customTheme },
    },
});
