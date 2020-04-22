## Demostration

### Homepage  `YaoyeLu`

-   Myprofile
    -   list of my restaurants
    -   list of my positions

### how a customer can `jiangyuan`

-   view menu 

-   place order
-   request assistant

### how a cook or a waiter can  `zitong`

-   recieve orders
-   `cook` start cooking, finish cooking
-   `waiter` start servring, finish serving
-   `waiter` commit to resolve a request : waiter cannot see the request

### how manager can

-   update menu  `Lu yaoye`
    -   create/update/delete menu item 
    -   create/update/delete category 
    
-   manage staff: invite & dismiss a staff  `Lu yaoye `

    >   performance: so slow

-   Dashboard   `zitong` 



### Backend

All backend RESTful API except `User request assitant` . 

Not including `websocket` for `cook` and `waiter`.





## Q&A

1.  confirm the bugs

2.  dashboard

4.  Zitong did analysis

5.  jiangyuan do the customer page

6.  **history data consistency**

    *   [x] delete is done by "archive" from backend

        bug: depends on current menuItem 
    

-   yaoye question:
    -   is the demo the final one? 
    -   we shall submit the final project and report.
    -   focus on fixing the bugs