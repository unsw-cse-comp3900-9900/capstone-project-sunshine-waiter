# API Documentation-- Restaurant order system

## Design references

-   [Basic API guideline](https://restfulapi.net/http-methods/)

-   [HTTP Code guide line](https://www.restapitutorial.com/httpstatuscodes.html)

-   ["401 vs 403" -- stackoverflow](https://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses)

## HTTP codes In this project

### HTTP Code design of multi-resourse operation

>   e.g `delete` a list of menuItem

If there are some of resources successfully perform the operation, you will receive `200` with a response body includes a list of resource ids that is not good.

Error message for each fail case are not promised to provide.

If you want to get error message, you can perform normal (single resource) request.



1.  `200` OK

    All good or "some good".

2.  `201` Created

    For `Post` only. 

3.  `204` No Content 

    Majorly for `Delete`. When you deleting something already deleted (or it simply never been created), you recieve a 204. 

4.  `400` Bad request

    Your request body doesn't contain correct data. It can be some key-value pair missing, some value's format is wrong (e.g. email, URL format is wrong). 

5.  `401` **Unauthorized**  

    Current user is not authenticated. Login/signup and then front end shall set the JWT on `x-auth-token`. 

6.  `403` forbidden

    Current user is authenticated, but don't have permission to perform such operation. 

    >   Please ask the restaurant owner/manager to give you the permission.

7.  `404` not found

    >   No such resource. You can double check the URL, resource id.

8.  `500` when server down/crash. 

    >   I wish you will never get this.

## Menu relative API

### Over view

-   There is only one object holding all dish for one restaurant, that is menu.
-   You can create a category in a menu. 
    -   There is a categoryList in menu. When you create a category, it will be added into the list.
-   You can create a menuItem in a menu
-   You can link a menuItem with category(s). 
    -   menuItem may link to 0, 1, or more than 1 category
-   You can delete a category from the categoryList
    -   When you do so, all menuItems in the restaurant will remove this category if applicable.

#### menu  ~~C~~ RU ~~D~~

-   C/D: There is no Create/Delete API over menu. When user creates restaurant, a menu will be created and bind to it. When the restaurant got deleted, the menu got cascade deleted as well.

-   R: Get menu metadata. This operation has two version: `basic-read` and  `manager-read`. The `manager0-read` may have more data than `basic-read`. Same URL, response depends on current user is a logged-in manger or not. 

    >   Note that if you want to read all the menu items, please request `GET /restaurants/restaurantId/menuItems/`.

    ```
    GET 'sw.com/api/restaurants/567813/menu/'
    header: {
    	x-auth-token: 'edftguyhjnklmd468f79gy8h0ujsfdasfid5rctvygibhunjif6g978h0u'
    }
    ```

    ```
    body: {
    	name: 'menu name',
    	description: 'description string',
    	pic: 'http://example.com/url-for-a-picutre.jpg'
    }
    ```
    
-   `Update` : require restaurant-manager. Scope is limited on menu meta data. e.g menu name, backgroud picture, description, etc.

    >   Note that we don't count operations including CRUD over categories and menuItems as part of  `Update` menu.
    
    ```
    PUT 'sw.com/api/restaurants/567813/menu/56579808'
    header: {
    	x-auth-token: 'edftguyhjnklmd468f79gy8h0ujsfdasfid5rctvygibhunjif6g978h0u'
    }
    body: {
    	name: 'new menu name',
    	description: 'new description string',
    }
    ```
    

#### categories CRUD

-   `Create`

    -   request (requires estaurant-manager)

    ```
    POST 'sw.com/api/restaurants/567813/categories/'
    
    header: {
    	x-auth-token: 'edftguyhjnklmd468f79gy8h0ujsfdasfid5rctvygibhunjif6g978h0u'
    }
    
    body: {
    	name: 'foo',
    	description: 'description for category'	
    }
    ```

    -   response  if data valid **200**; else **400** 

-   `Read`

    -   `Get One`

    ```
    GET 'sw.com/api/restaurants/567813/categories/categoryId'
    
    header: {
    	x-auth-token: 'edftguyhjnklmd468f79gy8h0ujsfdasfid5rctvygibhunjif6g978h0u'
    }
    ```

    -   `Get All`

    ```
GET 'sw.com/api/restaurants/567813/categories/'
    
    header: {
    	x-auth-token: 'edftguyhjnklmd468f79gy8h0ujsfdasfid5rctvygibhunjif6g978h0u'
    }
    ```
    
-   `Update`

    ```
    PUT 'sw.com/api/restaurants/567813/categories/categoryId'
    
    header: {
    	x-auth-token: 'edftguyhjnklmd468f79gy8h0ujsfdasfid5rctvygibhunjif6g978h0u'
    }
    body: {
    	name: 'foo',
    	description: 'description for category'	
    }
    ```

-   `Delete`  

    ```
    DELETE 'sw.com/api/restaurants/567813/categories/categoryId'
    
    header: {
    	x-auth-token: 'edftguyhjnklmd468f79gy8h0ujsfdasfid5rctvygibhunjif6g978h0u'
    }
    ```

    -   `200 (OK)` if the response includes an entity describing the status
    -    `204 (No Content)` if the action has been performed but the response does not include an entity.

#### menuItem CRUD

-   `Create`

    ```
    POST 'sw.com/api/restaurants/567813/menuItems/'
    
    header: {
    	x-auth-token: 'edftguyhjnklmd468f79gy8h0ujid5rctvygibhunjif6g978h0u'
    }
    
    body: {
    	name: 'foo',
    	description: '	description	description'
    	categories: ['67tyguhjf897y80up', '67tyguhjf897yuig9p8ouyg'],
    	// A list of category _id; This is optional
    }
    ```
    
-   `Read`

-   `Update`

-   `Delete`  many

    ```
    DELETE 'sw.com/api/restaurants/567813/menuItems/'
    header: {
    	x-auth-token: 'edftguyhjnklmd468f79gy8h0ujid5rctvygibhunjif6g978h0u'
    }
{
    	items: ['id_0','id_1','id_2','id_3']
    }
    ```
    
    
    
    

## Staff Management API

1.  ~~`Create` staff~~ invite users to become a staff 

    ```
    POST 'sw.com/api/restaurants/567813/staff-invitation'
    
    body: {
    	emailList: ['the_new_staff_1@gmail.com', 'the_new_staff_2@gmail.com', 'the_new_staff_3@gmail.com']
    }
    
    header: {
    	x-auth-token: 'edftguyhjnklmd468f79gy8h0ujid5rctvygibhunjif6g978h0u'
    }
    ```

    0.  all good: 200; already invited (all, partial): 200

        ```
        code: 200
        body: {
        	message: 'All invited.'
        }
        ```

    1.  some good, some emails not exist, some emails already a staff in side: 200

        ```
        code: 200
        body: {
        	message: 'Some eamil(s) does not match any existing user. Please check again.',
        	nonMatchEmailList: ['the_new_staff_2@gmail.com'],
        	alreadyInTeamList: ['the_new_staff_3@gmail.com']
        }
        ```

    2.  all emails not valid: 400

        ```
        code: 400
        body: {
        	message: 'All eamils don't match any existing user outside of your team. Please check again.',
        	nonMatchEmailList: ['the_new_staff_1@gmail.com', 'the_new_staff_2@gmail.com'],
        	alreadyInTeamList: ['the_new_staff_3@gmail.com']
        }
        ```

2.  `Read` all staff 

    ```
    GET 'sw.com/api/restaurants/567813/staffs/'
    header: {
    	x-auth-token: 'edftguyhjnklmd468f79gy8h0ujid5rctvygibhunjif6g978h0u'
    }
    ```

    1.  200 ( if authorized )

        ```
        code: 200
        body: {
            pendingEmailList: ['the_new_staff_1@gmail.com', 'the_new_staff_2@gmail.com'], 
            managers: [{
            	_id: 'asdf',
                name: "name_of_manager_1",
                email: 'manager_1@gmail.com'
            },
            {
                name: "name_of_manager_2",
                email: 'manager_2@gmail.com'
            },]
            cooks:[...]
            waiters:[...]
            cashiers:[...]
            basics:[...]
        }
        ```

    2.  401 **Unauthorized**

        ```
        code: 401
        body: {
        message: "You don't have permission to read staff. Only restaurant manager are permitted. Please contact your restaurant owner."
        }
        ```
        

3.  `Update` a staff's role/group

    >   When removed from any role, e.g. `cook`, target staff will automatically become a basic stuff in this restaurant.

    ```
    PUT 'sw.com/api/restaurants/567813/staffs/'
    header: {
    	x-auth-token: 'edftguyhjnklmd468f79gy8h0ujid5rctvygibhunjif6g978h0u'
    }
    body: {
    	op: 'add', // or remove
    	group: 'cook', // enum in restaurant userGroups
    	// not support direct update on "basic"
    	targetEmail: 'current_staff_1@gmail.com'
    }
    ```

    1.  targetEmail already in target goup when you add; or, not in the group when you remove
    2.  targetEmail does not match any staff in your restaurant
    3.  401 **Unauthorized** 

     

4.  ~~`delete` staff~~ remove a staff from this restaurant

    ```
    DELETE 'sw.com/api/restaurants/567813/staffs/'
    header: {
    	x-auth-token: 'edftguyhjnklmd468f79gy8h0ujid5rctvygibhunjif6g978h0u'
    }
    body: {
    	targetEmail: 'current_staff_1@gmail.com'
    }
    ```




## TODO

1.  user cannot update email address

2.  follow HTTP protocol on [401 response for jwt](https://stackoverflow.com/questions/33265812/best-http-authorization-header-type-for-jwt  )

3.  405 Method Not Allowed

    The method specified in the Request-Line is not allowed for the resource identified by the Request-URI. The response MUST include an Allow header containing a list of valid methods for the requested resource.



## TODESIGN

1.  Where to store our images. 
2.  