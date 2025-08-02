declare const GetBusinessFormationV2GetOrderOrderid: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly orderId: {
                    readonly type: "string";
                    readonly examples: readonly ["801VB00000LcJlVYAV"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Unique identifier of the order to retrieve full detail.";
                };
            };
            readonly required: readonly ["orderId"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly description: "The full response containing all details of a submitted business formation order.";
            readonly properties: {
                readonly statusCode: {
                    readonly type: "string";
                    readonly description: "HTTP status code of the response.";
                    readonly examples: readonly ["200"];
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "A human-readable message indicating success or failure.";
                    readonly examples: readonly ["OK"];
                };
                readonly data: {
                    readonly type: "object";
                    readonly description: "Wrapper for partner order data.";
                    readonly properties: {
                        readonly partnerOrder: {
                            readonly type: "object";
                            readonly description: "Full detail of the submitted business formation order.";
                            readonly properties: {
                                readonly orderGuid: {
                                    readonly type: "string";
                                    readonly description: "Unique identifier assigned to the order.";
                                };
                                readonly orderPhase: {
                                    readonly type: "string";
                                    readonly description: "The current phase of the order lifecycle.";
                                    readonly examples: readonly ["Order Received"];
                                };
                                readonly orderStatus: {
                                    readonly type: "string";
                                    readonly description: "Current status of the order in the system.";
                                    readonly examples: readonly ["Third Party Received"];
                                };
                                readonly orderFilingType: {
                                    readonly type: "string";
                                    readonly description: "Filing type of the order, if applicable.";
                                };
                                readonly apiUserPid: {
                                    readonly type: "string";
                                    readonly description: "ID of the API user who submitted the order.";
                                    readonly examples: readonly ["14684"];
                                };
                                readonly pcid: {
                                    readonly type: "string";
                                    readonly description: "Partner Client Identifier.";
                                    readonly examples: readonly ["gregerger"];
                                };
                                readonly businessStructureType: {
                                    readonly type: "string";
                                    readonly description: "Full name of the selected business entity structure.";
                                    readonly examples: readonly ["Limited Liability Company (LLC)"];
                                };
                                readonly businessStateInitial: {
                                    readonly type: "string";
                                    readonly description: "Full name of the U.S. state where the business is being formed.";
                                    readonly examples: readonly ["California"];
                                };
                                readonly orderTotalPrice: {
                                    readonly type: "number";
                                    readonly format: "float";
                                    readonly description: "Total price of the order in USD.";
                                    readonly examples: readonly [298.04];
                                    readonly minimum: -3.402823669209385e+38;
                                    readonly maximum: 3.402823669209385e+38;
                                };
                                readonly contact: {
                                    readonly type: "object";
                                    readonly description: "Contact person information for the order.";
                                    readonly properties: {
                                        readonly contactEmail: {
                                            readonly type: "string";
                                            readonly format: "email";
                                            readonly examples: readonly ["test1@test.com"];
                                        };
                                        readonly contactFirstName: {
                                            readonly type: "string";
                                            readonly examples: readonly ["test"];
                                        };
                                        readonly contactLastName: {
                                            readonly type: "string";
                                            readonly examples: readonly ["test"];
                                        };
                                        readonly contactPhone: {
                                            readonly type: "string";
                                        };
                                        readonly contactEveningPhone: {
                                            readonly type: "string";
                                        };
                                    };
                                };
                                readonly companyInfo: {
                                    readonly type: "object";
                                    readonly description: "Information about the company being formed.";
                                    readonly properties: {
                                        readonly companyDesiredName: {
                                            readonly type: "string";
                                            readonly examples: readonly ["Test company"];
                                        };
                                        readonly companyAlternativeName: {
                                            readonly type: "string";
                                        };
                                        readonly companyBusinessDescription: {
                                            readonly type: "string";
                                            readonly examples: readonly ["testing"];
                                        };
                                        readonly companyBusinessCategory: {
                                            readonly type: "string";
                                            readonly examples: readonly ["OTHER"];
                                        };
                                    };
                                };
                                readonly businessAddress: {
                                    readonly type: "object";
                                    readonly description: "Physical address where the business will be located.";
                                    readonly properties: {
                                        readonly businessAddressCountry: {
                                            readonly type: "string";
                                            readonly examples: readonly ["United States"];
                                        };
                                        readonly businessAddressAddress1: {
                                            readonly type: "string";
                                            readonly examples: readonly ["test"];
                                        };
                                        readonly businessAddressAddress2: {
                                            readonly type: "string";
                                        };
                                        readonly businessAddressCity: {
                                            readonly type: "string";
                                            readonly examples: readonly ["test"];
                                        };
                                        readonly businessAddressState: {
                                            readonly type: "string";
                                        };
                                        readonly businessAddressZip: {
                                            readonly type: "string";
                                            readonly examples: readonly ["78671"];
                                        };
                                    };
                                };
                                readonly registerAgent: {
                                    readonly type: "object";
                                    readonly description: "Registered agent information if available.";
                                    readonly additionalProperties: true;
                                };
                                readonly responsibleParty: {
                                    readonly type: "object";
                                    readonly description: "Responsible party details if provided.";
                                    readonly additionalProperties: true;
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetBusinessFormationV2OrderSummaryOrderid: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly orderId: {
                    readonly type: "string";
                    readonly examples: readonly ["801VB00000LcJlVYAV"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Unique identifier of the business formation order to retrieve the summary for.";
                };
            };
            readonly required: readonly ["orderId"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly description: "The response containing a summary of a submitted business formation order.";
            readonly properties: {
                readonly statusCode: {
                    readonly type: "string";
                    readonly description: "HTTP status code of the response.";
                    readonly examples: readonly ["200"];
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "A human-readable message indicating success or error.";
                    readonly examples: readonly ["OK"];
                };
                readonly order: {
                    readonly type: "object";
                    readonly description: "Summary details of the business formation order.";
                    readonly properties: {
                        readonly id: {
                            readonly type: "string";
                            readonly description: "Unique identifier of the order.";
                            readonly examples: readonly ["801VB00000LcJlVYAV"];
                        };
                        readonly orderNumber: {
                            readonly type: "string";
                            readonly description: "Public-facing order number assigned to the order.";
                            readonly examples: readonly ["07237721"];
                        };
                        readonly orderTotal: {
                            readonly type: "number";
                            readonly format: "float";
                            readonly description: "Total price of the order including all selected products.";
                            readonly examples: readonly [298.04];
                            readonly minimum: -3.402823669209385e+38;
                            readonly maximum: 3.402823669209385e+38;
                        };
                        readonly orderProducts: {
                            readonly type: "array";
                            readonly description: "List of all products included in the order with their respective values.";
                            readonly items: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly name: {
                                        readonly type: "string";
                                        readonly description: "Name of the ordered product or service.";
                                        readonly examples: readonly ["Obtain Federal Tax ID Number (EIN)"];
                                    };
                                    readonly value: {
                                        readonly type: "number";
                                        readonly format: "float";
                                        readonly description: "Price or value of the individual product in USD.";
                                        readonly examples: readonly [33];
                                        readonly minimum: -3.402823669209385e+38;
                                        readonly maximum: 3.402823669209385e+38;
                                    };
                                    readonly sortOrder: {
                                        readonly type: "integer";
                                        readonly description: "Sort order indicator for product display.";
                                        readonly examples: readonly [2];
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const GetBusinessFormationV2Package: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly entityType: {
                    readonly type: "string";
                    readonly examples: readonly ["LLC"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Type of business entity to form. Possible values are - LLC, C-Corp, S-Corp, Non-Profit Corporation, and Professional Corporation.";
                };
                readonly state: {
                    readonly type: "string";
                    readonly examples: readonly ["California"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The state in which the business is being formed.";
                };
                readonly filing: {
                    readonly type: "string";
                    readonly examples: readonly ["standard"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "The type of filing service requested (e.g., standard, express).";
                };
            };
            readonly required: readonly ["entityType", "state", "filing"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly description: "The response object containing available business formation packages.";
            readonly properties: {
                readonly message: {
                    readonly type: "string";
                    readonly description: "A human-readable status message.";
                    readonly examples: readonly ["OK"];
                };
                readonly statusCode: {
                    readonly type: "string";
                    readonly description: "The HTTP status code of the response in string format.";
                    readonly examples: readonly ["200"];
                };
                readonly value: {
                    readonly type: "object";
                    readonly description: "Contains the package collection based on query parameters.";
                    readonly properties: {
                        readonly packageCollection: {
                            readonly type: "array";
                            readonly description: "A list of available formation packages.";
                            readonly items: {
                                readonly type: "object";
                                readonly description: "Details of a specific package offering.";
                                readonly properties: {
                                    readonly entityType: {
                                        readonly type: "string";
                                        readonly description: "The type of business entity the package applies to (e.g., llc, corp).";
                                        readonly examples: readonly ["llc"];
                                    };
                                    readonly name: {
                                        readonly type: "string";
                                        readonly description: "The name of the package (e.g., Basic Package, Premium Package).";
                                        readonly examples: readonly ["Basic Package"];
                                    };
                                    readonly state: {
                                        readonly type: "string";
                                        readonly description: "The U.S. state where the package is applicable.";
                                        readonly examples: readonly ["California"];
                                    };
                                    readonly productPackages: {
                                        readonly type: "array";
                                        readonly description: "List of individual services or features included in the package.";
                                        readonly items: {
                                            readonly type: "object";
                                            readonly properties: {
                                                readonly name: {
                                                    readonly type: "string";
                                                    readonly description: "The name of the service included in the package.";
                                                    readonly examples: readonly ["Name Availability Check"];
                                                };
                                                readonly price: {
                                                    readonly type: "number";
                                                    readonly format: "float";
                                                    readonly description: "The price of the individual service in USD.";
                                                    readonly examples: readonly [34];
                                                    readonly minimum: -3.402823669209385e+38;
                                                    readonly maximum: 3.402823669209385e+38;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly statusCode: {
                    readonly type: "integer";
                    readonly examples: readonly [400];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["success"];
                };
                readonly errorMessage: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly examples: readonly ["Entity is required."];
                };
                readonly data: {};
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly statusCode: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["error"];
                };
                readonly errorMessage: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly examples: readonly ["Invalid API key."];
                };
                readonly data: {};
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly statusCode: {
                    readonly type: "integer";
                    readonly examples: readonly [403];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["error"];
                };
                readonly errorMessage: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly examples: readonly ["API key is missing."];
                };
                readonly data: {};
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly statusCode: {
                    readonly type: "integer";
                    readonly examples: readonly [500];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["error"];
                };
                readonly errorMessage: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly examples: readonly ["Something went wrong. Please try again later."];
                };
                readonly data: {};
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostBusinessFormationDownloadOrderDocumentV1: {
    readonly response: {
        readonly "200": {
            readonly type: "string";
            readonly format: "binary";
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostBusinessFormationOrderCancellationV1Orderguid: {
    readonly metadata: {
        readonly allOf: readonly [{
            readonly type: "object";
            readonly properties: {
                readonly orderGuid: {
                    readonly type: "string";
                    readonly format: "uuid";
                    readonly examples: readonly ["a1b2c3d4-e5f6-7890-ab12-cd34ef567890"];
                    readonly $schema: "http://json-schema.org/draft-04/schema#";
                    readonly description: "Unique identifier for the order to be cancelled. This GUID is generated during order creation.";
                };
            };
            readonly required: readonly ["orderGuid"];
        }];
    };
    readonly response: {
        readonly "200": {
            readonly type: "object";
            readonly properties: {
                readonly statusCode: {
                    readonly type: "string";
                    readonly examples: readonly ["200"];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["OK"];
                };
                readonly data: {
                    readonly type: "boolean";
                    readonly examples: readonly [true];
                };
                readonly orderCancelled: {
                    readonly type: "boolean";
                    readonly examples: readonly [true];
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "400": {
            readonly type: "object";
            readonly properties: {
                readonly statusCode: {
                    readonly type: "integer";
                    readonly examples: readonly [400];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["error"];
                };
                readonly errorMessage: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly examples: readonly ["Invalid order GUID."];
                };
                readonly data: {};
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "401": {
            readonly type: "object";
            readonly properties: {
                readonly statusCode: {
                    readonly type: "integer";
                    readonly examples: readonly [401];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["error"];
                };
                readonly errorMessage: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly examples: readonly ["Invalid API key."];
                };
                readonly data: {};
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "403": {
            readonly type: "object";
            readonly properties: {
                readonly statusCode: {
                    readonly type: "integer";
                    readonly examples: readonly [403];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["error"];
                };
                readonly errorMessage: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly examples: readonly ["API key is missing."];
                };
                readonly data: {};
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
        readonly "500": {
            readonly type: "object";
            readonly properties: {
                readonly statusCode: {
                    readonly type: "integer";
                    readonly examples: readonly [500];
                };
                readonly message: {
                    readonly type: "string";
                    readonly examples: readonly ["error"];
                };
                readonly errorMessage: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly examples: readonly ["Something went wrong. Please try again later."];
                };
                readonly data: {};
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
declare const PostBusinessFormationV2CreateOrder: {
    readonly body: {
        readonly type: "object";
        readonly required: readonly ["partnerOrder"];
        readonly properties: {
            readonly partnerOrder: {
                readonly type: "object";
                readonly required: readonly ["apiUserPid", "pcid", "businessStructureType", "businessStateInitial", "orderTotalPrice", "contact", "companyInfo", "businessAddress", "registerAgent", "packageId", "products"];
                readonly properties: {
                    readonly apiUserPid: {
                        readonly type: "string";
                        readonly description: "API user identifier assigned to the partner.";
                        readonly examples: readonly ["14684"];
                    };
                    readonly pcid: {
                        readonly type: "string";
                        readonly description: "Partner client identifier used to track the request.";
                        readonly examples: readonly ["gregerger"];
                    };
                    readonly businessStructureType: {
                        readonly type: "string";
                        readonly description: "Type of business entity being formed (e.g., LLC, Corporation).";
                        readonly examples: readonly ["LLC"];
                    };
                    readonly businessStateInitial: {
                        readonly type: "string";
                        readonly description: "Two-letter abbreviation of the U.S. state where the business is being formed.";
                        readonly examples: readonly ["CA"];
                    };
                    readonly orderTotalPrice: {
                        readonly type: "string";
                        readonly description: "Total price of the order in USD.";
                        readonly examples: readonly ["200"];
                    };
                    readonly contact: {
                        readonly type: "object";
                        readonly properties: {
                            readonly contactEmail: {
                                readonly type: "string";
                                readonly format: "email";
                                readonly description: "Email address of the primary contact person.";
                                readonly examples: readonly ["test1@test.com"];
                            };
                            readonly contactFirstName: {
                                readonly type: "string";
                                readonly description: "First name of the contact person.";
                                readonly examples: readonly ["test"];
                            };
                            readonly contactLastName: {
                                readonly type: "string";
                                readonly description: "Last name of the contact person.";
                                readonly examples: readonly ["test"];
                            };
                            readonly contactPhone: {
                                readonly type: "string";
                                readonly description: "Primary phone number of the contact person.";
                                readonly examples: readonly ["1234567891"];
                            };
                            readonly contactEveningPhone: {
                                readonly type: "string";
                                readonly description: "Optional evening phone number of the contact person.";
                                readonly examples: readonly [""];
                            };
                        };
                    };
                    readonly companyInfo: {
                        readonly type: "object";
                        readonly properties: {
                            readonly companyDesiredName: {
                                readonly type: "string";
                                readonly description: "Desired name for the new business entity.";
                                readonly examples: readonly ["Test company"];
                            };
                            readonly companyAlternativeName: {
                                readonly type: "string";
                                readonly description: "Optional alternative business name.";
                                readonly examples: readonly [""];
                            };
                            readonly companyBusinessCategory: {
                                readonly type: "string";
                                readonly description: "Category of business operations (e.g., retail, services).";
                                readonly examples: readonly ["other"];
                            };
                            readonly companyBusinessDescription: {
                                readonly type: "string";
                                readonly description: "Brief description of the business activities.";
                                readonly examples: readonly ["testing"];
                            };
                        };
                    };
                    readonly businessAddress: {
                        readonly type: "object";
                        readonly properties: {
                            readonly businessAddressCountry: {
                                readonly type: "string";
                                readonly description: "Country of the business address.";
                                readonly examples: readonly ["US"];
                            };
                            readonly businessAddressAddress1: {
                                readonly type: "string";
                                readonly description: "Primary street address of the business.";
                                readonly examples: readonly ["test"];
                            };
                            readonly businessAddressAddress2: {
                                readonly type: "string";
                                readonly description: "Secondary address (optional).";
                                readonly examples: readonly [""];
                            };
                            readonly businessAddressCity: {
                                readonly type: "string";
                                readonly description: "City name of the business address.";
                                readonly examples: readonly ["test"];
                            };
                            readonly businessAddressState: {
                                readonly type: "string";
                                readonly description: "State abbreviation of the business address.";
                                readonly examples: readonly ["CA"];
                            };
                            readonly businessAddressZip: {
                                readonly type: "string";
                                readonly description: "ZIP or postal code of the business address.";
                                readonly examples: readonly ["78671"];
                            };
                        };
                    };
                    readonly registerAgent: {
                        readonly type: "object";
                        readonly properties: {
                            readonly registeredAgentIsCorpnetAgent: {
                                readonly type: "boolean";
                                readonly description: "Indicates if CorpNet will act as the registered agent.";
                                readonly examples: readonly [true];
                            };
                            readonly registeredAgentFirstName: {
                                readonly type: "string";
                                readonly description: "First name of the registered agent (if not CorpNet).";
                                readonly examples: readonly [""];
                            };
                            readonly registeredAgentLastName: {
                                readonly type: "string";
                                readonly description: "Last name of the registered agent (if not CorpNet).";
                                readonly examples: readonly [""];
                            };
                            readonly registeredAgentAddress1: {
                                readonly type: "string";
                                readonly description: "Registered agent’s address line 1.";
                                readonly examples: readonly [""];
                            };
                            readonly registeredAgentAddress2: {
                                readonly type: "string";
                                readonly description: "Registered agent’s address line 2 (optional).";
                                readonly examples: readonly [""];
                            };
                            readonly registeredAgentCity: {
                                readonly type: "string";
                                readonly description: "City of the registered agent.";
                                readonly examples: readonly [""];
                            };
                            readonly registeredAgentState: {
                                readonly type: "string";
                                readonly description: "State of the registered agent.";
                                readonly examples: readonly [""];
                            };
                            readonly registeredAgentZip: {
                                readonly type: "string";
                                readonly description: "ZIP code of the registered agent.";
                                readonly examples: readonly [""];
                            };
                            readonly registeredAgentCountry: {
                                readonly type: "string";
                                readonly description: "Country of the registered agent.";
                                readonly examples: readonly [""];
                            };
                        };
                    };
                    readonly packageId: {
                        readonly type: "string";
                        readonly description: "Identifier for the selected business formation package.";
                        readonly examples: readonly ["01tUS000009xuhDYAQ"];
                    };
                    readonly products: {
                        readonly type: "array";
                        readonly description: "List of products included in the order.";
                        readonly items: {
                            readonly type: "object";
                            readonly properties: {
                                readonly productId: {
                                    readonly type: "string";
                                    readonly description: "Identifier for the product to include.";
                                    readonly examples: readonly ["01tUS000009xuh7YAA"];
                                };
                                readonly quantity: {
                                    readonly type: "string";
                                    readonly description: "Quantity of the selected product.";
                                    readonly examples: readonly ["1"];
                                };
                            };
                        };
                    };
                };
            };
        };
        readonly $schema: "http://json-schema.org/draft-04/schema#";
    };
    readonly response: {
        readonly "201": {
            readonly type: "object";
            readonly description: "The response returned after successfully creating a business formation order.";
            readonly properties: {
                readonly statusCode: {
                    readonly type: "integer";
                    readonly description: "HTTP status code indicating the result of the request.";
                    readonly examples: readonly [201];
                };
                readonly message: {
                    readonly type: "string";
                    readonly description: "Status message indicating the result.";
                    readonly examples: readonly ["success"];
                };
                readonly data: {
                    readonly type: "object";
                    readonly description: "Contains the created order details.";
                    readonly properties: {
                        readonly partnerOrder: {
                            readonly type: "object";
                            readonly description: "The partner's submitted order with assigned metadata.";
                            readonly properties: {
                                readonly orderGuid: {
                                    readonly type: "string";
                                    readonly description: "Unique identifier for the created order.";
                                    readonly examples: readonly ["801VB00000LcJlVYAV"];
                                };
                                readonly orderPhase: {
                                    readonly type: "string";
                                    readonly description: "Current processing phase of the order.";
                                    readonly examples: readonly ["Order Received"];
                                };
                                readonly orderStatus: {
                                    readonly type: "string";
                                    readonly description: "Current status of the order.";
                                    readonly examples: readonly ["Third Party Received"];
                                };
                                readonly orderFilingType: {
                                    readonly type: "string";
                                    readonly description: "Type of filing service selected (if any).";
                                };
                                readonly apiUserPid: {
                                    readonly type: "string";
                                    readonly description: "API user ID that initiated the order.";
                                    readonly examples: readonly ["14684"];
                                };
                                readonly pcid: {
                                    readonly type: "string";
                                    readonly description: "Partner Client ID.";
                                    readonly examples: readonly ["gregerger"];
                                };
                                readonly businessStructureType: {
                                    readonly type: "string";
                                    readonly description: "Full description of the business structure selected.";
                                    readonly examples: readonly ["Limited Liability Company (LLC)"];
                                };
                                readonly businessStateInitial: {
                                    readonly type: "string";
                                    readonly description: "State abbreviation where the business is being formed.";
                                };
                            };
                        };
                    };
                };
            };
            readonly $schema: "http://json-schema.org/draft-04/schema#";
        };
    };
};
export { GetBusinessFormationV2GetOrderOrderid, GetBusinessFormationV2OrderSummaryOrderid, GetBusinessFormationV2Package, PostBusinessFormationDownloadOrderDocumentV1, PostBusinessFormationOrderCancellationV1Orderguid, PostBusinessFormationV2CreateOrder };
