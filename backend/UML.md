@startuml
class "User Entity" {
    + UserID (PK)
    + Username
    + Password
    + Email
    + DateJoined
    + Budget
    + UserProfilePictureURL
}

class "Transaction Entity" {
    + TransactionID (PK)
    + UserID (FK)
    + Amount
    + TransactionType ('Credit', 'Debit')
    + PaymentMethod ('Cash', 'Credit Card', ...)
    + Date
}

class "Purchase" {
    + PurchaseID (PK)
    + TransactionID (FK)
    + ItemName
    + ItemPrice
    + Quantity
}

class "Receipts Entity" {
    + ReceiptID (PK)
    + TransactionID (FK)
    + StoreName
    + TotalAmount
    + Tax
    + ReceiptImageURL (from Cloud Storage)
}

class "Financial Goals Entity" {
    + GoalID (PK)
    + UserID (FK)
    + TargetAmount
    + StartDate
    + EndDate/TargetDate
}

class "Financial Recommendations Entity" {
    + RecommendationID (PK)
    + UserID (FK)
    + RelevanceScore/Priority
}

class "Notifications Entity" {
    + NotificationID (PK)
    + UserID (FK)
    + Message
    + Status ('Read', 'Unread')
}

class "Categories Entity" {
    + CategoryID (PK)
    + CategoryName
}

"User Entity" --> "Transaction Entity" : Has
"Transaction Entity" --> "Purchase" : Contains
"Transaction Entity" --> "Receipts Entity" : Generates
"User Entity" --> "Financial Goals Entity" : Sets
"User Entity" --> "Financial Recommendations Entity" : Receives
"User Entity" --> "Notifications Entity" : Gets
"Transaction Entity" --> "Categories Entity" : Categorized as
@enduml