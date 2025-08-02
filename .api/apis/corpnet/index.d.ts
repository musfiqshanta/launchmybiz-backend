import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core';
import Oas from 'oas';
import APICore from 'api/dist/core';
declare class SDK {
    spec: Oas;
    core: APICore;
    constructor();
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    config(config: ConfigOptions): void;
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
    auth(...values: string[] | number[]): this;
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
    server(url: string, variables?: {}): void;
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
    getBusinessFormationV2Package(metadata: types.GetBusinessFormationV2PackageMetadataParam): Promise<FetchResponse<200, types.GetBusinessFormationV2PackageResponse200>>;
    /**
     * Creates a new business formation order using partner-supplied details including contact,
     * company info, business address, selected package, and products.
     *
     * @summary Create a Business Formation Order
     */
    postBusinessFormationV2CreateOrder(body: types.PostBusinessFormationV2CreateOrderBodyParam): Promise<FetchResponse<201, types.PostBusinessFormationV2CreateOrderResponse201>>;
    /**
     * Retrieve a summary of a submitted business formation order, including order total and
     * purchased products.
     *
     * @summary Get Order Summary
     */
    getBusinessFormationV2OrderSummaryOrderid(metadata: types.GetBusinessFormationV2OrderSummaryOrderidMetadataParam): Promise<FetchResponse<200, types.GetBusinessFormationV2OrderSummaryOrderidResponse200>>;
    /**
     * Retrieve the full details of a submitted business formation order including contact,
     * address, company info, and processing status.
     *
     * @summary Get Full Order Details
     */
    getBusinessFormationV2GetOrderOrderid(metadata: types.GetBusinessFormationV2GetOrderOrderidMetadataParam): Promise<FetchResponse<200, types.GetBusinessFormationV2GetOrderOrderidResponse200>>;
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
    postBusinessFormationOrderCancellationV1Orderguid(metadata: types.PostBusinessFormationOrderCancellationV1OrderguidMetadataParam): Promise<FetchResponse<200, types.PostBusinessFormationOrderCancellationV1OrderguidResponse200>>;
    /**
     * Downloads a document associated with a formation order.
     *
     * @summary Download Order Document
     */
    postBusinessFormationDownloadOrderDocumentV1(): Promise<FetchResponse<200, types.PostBusinessFormationDownloadOrderDocumentV1Response200>>;
    /**
     * Sends a document via email related to a business formation order.
     *
     * @summary Email Order Document
     */
    postBusinessFormationSendOrderDocumentV1(): Promise<FetchResponse<number, unknown>>;
    /**
     * Updates the details of an existing business formation order.
     *
     * @summary Update Order Information
     */
    postBusinessFormationUpdateOrderV1(): Promise<FetchResponse<number, unknown>>;
}
declare const   createSDK: SDK;
export  = createSDK;
