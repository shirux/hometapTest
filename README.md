# Solution Documentation

## Project Overview

This project contains both backend and frontEnd solutions based on a homeTap test exercise with a given templates.
The exercise allows a user to input an address and some property providers will be displayed as a result of this address search.
Backend and FrontEnd are communicating via REST API.

## Requirements

The following tools are required to start this project:

- Docker

## Deployment

A .env.example file will be found on the root folder.
Duplicate this file and rename it to .env. Set the needed variables for the project to be executed and communicated correctly

Once the .env file is created and Docker is running on your local machine the following commands must be executed

```sh
docker-compose build
docker-compose up
```

## Architecture

### Backend Architecture

Backend use Django framework and a template was delivered by hometap with a basic application called properties.
The backend was extended to have a shared application (also known as common) where different services, schemas, models, repositories, exceptions, decorators, etc. can be found and used across multiple applications
The property app was changed in order to fit into a DDD architecture, yet this was not fully delivered since django already has a structure for every application that must be preserved. Even with that limitation the application has different layers on which data, business rules or logic, validation and different layers has its responsibilities well defined.

### Frontend Architecture

FrontEnd is using React and a template with an unique Component (app component) was delivered by hometap.
This application was extended to have now routing features and different components per navigation page and reusable components (such as SearchBar).
Every one of those new components have its own responsibilities well defined and both states and props are well managed between them.
This will help future developers to easily extend the frontEnd application with new features.

## Implemented Features

### Core Functionality

Application will retrieve different provider properties by a given address. The address will be validated and (by now) only two properties will be retrieved and shown in a table.

### API Endpoints

The backend currently exposes a single API endpoint.

| Method | Endpoint                | Description                      |
| ------ | ----------------------- | -------------------------------- |
| GET    | /properties?address=xyz | Find property details by address |

## Technical Implementation Details

### Backend Implementation

Backend is extended with:

- **ThreadPoolExecutor**: Concurrency at the moment of property retrieval process on external service
- **Property service**: handle all business rules related to properties (Not a single rule exist by now but a example can be given: Hide all properties which size are bigger than X defined by business)
- **External property repository**: In charge of retrieving in parallel different property given by providers
- **Exception handler decorator**: Decorator function what will wrap methods to ensure that exceptions are well handled in an unique way, such as logging or hidding error messages that has sensible information
- **Base Provider repository**: Provider Parent class responsible for retrieving data from one provider and then serializing it to a specific format
- **Schemas**: Validate incomming data with pydantic library
- **Exceptions**: Custom exceptions with default messages and status codes

Also the following files were changed:

- **urls**: Change how the view were invoked (classes instead of methods)
- **views**: Changed from single methods to classes
- **test**: Changed assert test message to reflect custom error default message
- **settings**: New setting properties were added reflecting the .env.example given

### Frontend Implementation

FrontEnd also changed and the application no longer has one single component with all responsibility but 5 or more that will be described below:

- **HomePage**: HomePage component that will only display hometap title and search bar
- **HometapTitle**: Component that will render hometap title. On click it will navigate to homePage
- **PropertyResultsPage**: Component that will render hometap title, search bar with current search terms (by params) and a propertyTable if data is retrieved succesfully (otherwise only an error will be shown)
- **PropertyTable**: Component that will render a table with specific properties (given on assets)
- **SearchBar**: Component that will render a search bar composed by an input and a search button. Handler functions are passed as props

Routing was added on the App Component so we have two navigation routes:

- /: HomePage
- /properties?address=xyz: PropertyResultsPage

## Challenges & Solutions

One of the challenges found during this technical test that I found was that the results given by providers are not always the same (json properties are not camelCase, they sometimes has UpperCase at the beggining, or some properties may change its full name. Ex: "LotSizeAcres" are sometimes "LotSizeSqFt").
In order to solve this issue a parent class was created on the backend that use a pydantic object to serialize correctly different formats for different providers. Each children class will extend from this and have a specific serializer method implemented on the pydantic object. This will allow the application to be easily maintainable and more flexible.

Another challenge that I found was that once the ThreadPoolExecutor implementation was done, the order of the providers was affected (sometimes it will show provider 2 first and provider 1 second). To solve this a new property was attached (order) in all provider properties at backend level. This was received in the frontEnd and the incomming results keys were sorted so the table will always show the requested order for all providers (This is dynamically done so in the scenario more property providers are given on the response they will be shown correctly on the table)

## Future Enhancements & Extensions

### Short-term Improvements

- **FrontEnd validations**: Route validations when the parameters are empty should be applied
- **Property per provider**: Since the business logic is still somehow unknown some properties looks like missmatched on the frontEnd. A requirement landing will help fix this kind of issues (Lot Size (Acres) is the one with the only difference between providers)
- **Integrate address**: Right now address is just being validated, but not used for retrieving properties, they are randomly generated on external service
- **Segregate apps on different repositories**: More control over specific applications across the team

### Long-term Enhancements

- **Authentication/Authorization**: Application will have an authorization & authentication layer on which every user has its preferences and related entities (Ex: my properties, my loans, etc)
- **Provider/Consumer component**: Share states across mutliple comsumer componenets. This will avoid some components with overloaded states
- **Provider turn ON/OFF**: Instead of the hardcoded providers the team can move them to an object within an AWS appConfig to have a better control on which should be working at a specific moment of time

## Use of AI tools

Claude Code was used at some part of this development process, specially on the following aspects:

- Html & Css generating code (some given html code was not mobile friendly)
- PropertyResultPage normalization and format methods (To fasten the solution on the detected & mentioned challenge that was found)
- Testings

## Lessons Learned & Conclusion

As a cloud/backend developer it was very interesting to use again React (I took some courses long time ago and the basic knowledge on how to use components, their states and props was very interesting). I took some decisions at backend and frontEnd level with the collected expertise on previous job experiences and felt happy to reflect those in this technical challenge
