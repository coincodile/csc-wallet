/** @odoo-module */
import { Component, xml } from "@odoo/owl";

import { ErrorHandler, components, template } from "./components";
import { registry } from "./registry";
import { useBus } from "./utils/hooks";

@components({ ErrorHandler })
@template(xml`<div class="o-main-components-container">
    <t t-foreach="Components" t-as="C" t-key="C[0]">
        <ErrorHandler onError="error => this.handleComponentError(error, C)">
            <t t-component="C[1].Component" t-props="C[1].props"/>
        </ErrorHandler>
    </t>
</div>`)
export class MainComponentsContainer extends Component {
    Components: any[];

    setup() {
        const mainComponents = registry.category("main_components");
        this.Components = mainComponents.getEntries();
        useBus(mainComponents, "UPDATE", () => {
            this.Components = mainComponents.getEntries();
            this.render();
        });
    }

    handleComponentError(error, C) {
        // remove the faulty component and rerender without it
        this.Components.splice(this.Components.indexOf(C), 1);
        this.render();
        /**
         * we rethrow the error to notify the user something bad happened.
         * We do it after a tick to make sure owl can properly finish its
         * rendering
         */
        Promise.resolve().then(() => {
            throw error;
        });
    }
}

