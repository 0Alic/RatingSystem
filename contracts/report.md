## Sūrya's Description Report

### Files Description Table


|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| AssetStorage.sol | 6e546866d450e637cdcbdbe836c06dbeb4b75521 |
| ComputerRegistry.sol | 45bbfc801c4064f5bb8fcf1644499ca044a49944 |
| Interfaces.sol | 4918ab6c3787410948e4d0306d40d1ff3babff8b |
| Item.sol | cf8825ea3b272d1658bfa6d132c07f5df41348f8 |
| Migrations.sol | b6732a145e4cb6841945488f591b1cf383a6441e |
| RatingComputer.sol | 44a06e45a7b6ae5a8c3b159350ef1ed0eeb86fae |
| RatingLibrary.sol | 8269591bc95b008c507d2f48c9a82c8ef6856922 |
| RatingSystem.sol | e90b5172a026f76d60ef8b6471bf35056b9d8913 |
| User.sol | bea6569bc01770d126d5ee3a4f46d63124f51844 |


### Contracts Description Table


|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **AssetStorage** | Implementation |  |||
| └ | insert | Public ❗️ | 🛑  | |
| └ | remove | Public ❗️ | 🛑  | |
| └ | isIn | Public ❗️ |   | |
| └ | getCount | Public ❗️ |   | |
| └ | getAssets | External ❗️ |   | |
||||||
| **StoragePointer** | Implementation | AssetStorage |||
| └ | insert | Public ❗️ | 🛑  | |
| └ | remove | Public ❗️ | 🛑  | |
| └ | isIn | Public ❗️ |   | |
| └ | getCount | Public ❗️ |   | |
| └ | getAssets | External ❗️ |   | |
| └ | getKeyAt | Public ❗️ |   | |
||||||
| **OwnableCRUDStorage** | Implementation | StoragePointer, Ownable |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | Ownable |
| └ | insert | Public ❗️ | 🛑  | isOwner |
| └ | remove | Public ❗️ | 🛑  | isOwner |
||||||
| **ComputerRegistry** | Implementation | Ownable |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | Ownable |
| └ | pushComputer | External ❗️ | 🛑  | isOwner |
| └ | getComputer | External ❗️ |   | |
| └ | getIds | External ❗️ |   | |
||||||
| **Ownable** | Implementation |  |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | |
| └ | changeOwner | Public ❗️ | 🛑  | isOwner |
||||||
| **Permissioned** | Implementation | Ownable |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | Ownable |
| └ | grantPermission | Public ❗️ | 🛑  | isOwner |
| └ | revokePermission | Public ❗️ | 🛑  | |
| └ | checkForPermission | Public ❗️ |   | |
| └ | getMyPolicy | Public ❗️ |   | |
||||||
| **Item** | Implementation | Permissioned |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | Permissioned |
| └ | rate | External ❗️ | 🛑  | |
| └ | changeComputer | External ❗️ | 🛑  | isOwner |
| └ | computeRate | External ❗️ |   | |
| └ | getAllRatings | External ❗️ |   | |
||||||
| **Migrations** | Implementation |  |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | |
| └ | setCompleted | Public ❗️ | 🛑  | restricted |
| └ | upgrade | Public ❗️ | 🛑  | restricted |
||||||
| **RatingComputer** | Interface |  |||
| └ | compute | External ❗️ |   | |
||||||
| **SimpleAvarageComputer** | Implementation | RatingComputer |||
| └ | compute | External ❗️ |   | |
||||||
| **WeightedAverageComputer** | Implementation | RatingComputer |||
| └ | compute | External ❗️ |   | |
||||||
| **RatingLibrary** | Library |  |||
||||||
| **RatingSystemFramework** | Implementation | Ownable |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | Ownable |
| └ | createUser | External ❗️ | 🛑  | |
| └ | deleteUser | External ❗️ | 🛑  | |
| └ | getMyUserContract | External ❗️ |   | |
| └ | getUsers | External ❗️ |   | |
| └ | isIn | External ❗️ |   | |
| └ | userCount | External ❗️ |   | |
| └ | getUserByIndex | External ❗️ |   | |
||||||
| **User** | Implementation | Ownable |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | Ownable |
| └ | rate | External ❗️ | 🛑  | isOwner |
| └ | createItem | External ❗️ | 🛑  | isOwner |
| └ | deleteItem | External ❗️ | 🛑  | isOwner |
| └ | getAllRatings | External ❗️ |   | |
| └ | getItems | External ❗️ |   | |
| └ | isIn | External ❗️ |   | |
| └ | itemCount | External ❗️ |   | |
| └ | getItemByIndex | External ❗️ |   | |


### Legend

|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
