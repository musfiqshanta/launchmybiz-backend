"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var oas_1 = __importDefault(require("oas"));
var core_1 = __importDefault(require("api/dist/core"));
var openapi_json_1 = __importDefault(require("./openapi.json"));
var SDK = /** @class */ (function () {
    function SDK() {
        this.spec = oas_1.default.init(openapi_json_1.default);
        this.core = new core_1.default(this.spec, 'corpnet/1.0.0 (api/6.1.3)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    SDK.prototype.config = function (config) {
        this.core.setConfig(config);
    };
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    SDK.prototype.auth = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        (_a = this.core).setAuth.apply(_a, values);
        return this;
    };
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    SDK.prototype.server = function (url, variables) {
        if (variables === void 0) { variables = {}; }
        this.core.setServer(url, variables);
    };
    /**
     * Retrieve a list of available formation packages based on the selected entity type,
     * state, and filing option.
     *
     * @summary Get Formation Packages
     * @throws FetchError<400, types.GetBusinessFormationV2PackageResponse400> Bad Request – Missing or invalid query parameters.
     * @throws FetchError<401, types.GetBusinessFormationV2PackageResponse401> Unauthorized – Invalid or missing authentication token.
     * @throws FetchError<403, types.GetBusinessFormationV2PackageResponse403> Forbidden – You do not have access to this resource.
     * @throws FetchError<500, types.GetBusinessFormationV2PackageResponse500> Internal Server Error – An unexpected error occurred on the server.
     */
    SDK.prototype.getBusinessFormationV2Package = function (metadata) {
        return this.core.fetch('/business-formation-v2/package', 'get', metadata);
    };
    /**
     * Creates a new business formation order using partner-supplied details including contact,
     * company info, business address, selected package, and products.
     *
     * @summary Create a Business Formation Order
     */
    SDK.prototype.postBusinessFormationV2CreateOrder = function (body) {
        return this.core.fetch('/business-formation-v2/create-order', 'post', body);
    };
    /**
     * Retrieve a summary of a submitted business formation order, including order total and
     * purchased products.
     *
     * @summary Get Order Summary
     */
    SDK.prototype.getBusinessFormationV2OrderSummaryOrderid = function (metadata) {
        return this.core.fetch('/business-formation-v2/order-summary/{orderId}', 'get', metadata);
    };
    /**
     * Retrieve the full details of a submitted business formation order including contact,
     * address, company info, and processing status.
     *
     * @summary Get Full Order Details
     */
    SDK.prototype.getBusinessFormationV2GetOrderOrderid = function (metadata) {
        return this.core.fetch('/business-formation-v2/get-order/{orderId}', 'get', metadata);
    };
    /**
     * Cancels a business formation order using the provided order GUID. This action is
     * irreversible.
     *
     * @summary Cancel a Business Formation Order
     * @throws FetchError<400, types.PostBusinessFormationOrderCancellationV1OrderguidResponse400> Bad Request – Invalid or missing orderGuid.
     * @throws FetchError<401, types.PostBusinessFormationOrderCancellationV1OrderguidResponse401> Unauthorized – Invalid or missing authentication token.
     * @throws FetchError<403, types.PostBusinessFormationOrderCancellationV1OrderguidResponse403> Forbidden – Access denied for this resource.
     * @throws FetchError<500, types.PostBusinessFormationOrderCancellationV1OrderguidResponse500> Internal Server Error – Unexpected server error.
     */
    SDK.prototype.postBusinessFormationOrderCancellationV1Orderguid = function (metadata) {
        return this.core.fetch('/business-formation/order-cancellation-v1/{orderGuid}', 'post', metadata);
    };
    /**
     * Downloads a document associated with a formation order.
     *
     * @summary Download Order Document
     */
    SDK.prototype.postBusinessFormationDownloadOrderDocumentV1 = function () {
        return this.core.fetch('/business-formation/download-order-document-v1/', 'post');
    };
    /**
     * Sends a document via email related to a business formation order.
     *
     * @summary Email Order Document
     */
    SDK.prototype.postBusinessFormationSendOrderDocumentV1 = function () {
        return this.core.fetch('/business-formation/send-order-document-v1/', 'post');
    };
    /**
     * Updates the details of an existing business formation order.
     *
     * @summary Update Order Information
     */
    SDK.prototype.postBusinessFormationUpdateOrderV1 = function () {
        return this.core.fetch('/business-formation/update-order-v1/', 'post');
    };
    return SDK;
}());
var createSDK = (function () { return new SDK(); })();
module.exports = createSDK;
