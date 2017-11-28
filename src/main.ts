/**
 * @Author: Nicolas Fazio <webmaster-fazio>
 * @Date:   28-11-2017
 * @Email:  contact@nicolasfazio.ch
 * @Last modified by:   webmaster-fazio
 * @Last modified time: 28-11-2017
 */

import { App } from "./app/app";

export default class Main {
    constructor() {
        console.log('Typescript Webpack starter launched with success!!');
        new App()
    }
}

let start = new Main();
