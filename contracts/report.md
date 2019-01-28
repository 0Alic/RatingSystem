## Sūrya's Description Report

### Files Description Table


|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| AssetStorage.sol | 4a3c4a1002a08882b80d2168ae76247cce82fb1a |
| ComputerRegistry.sol | 91e46fa6b9ba378f7191b882317d1636effcc338 |
| Interfaces.sol | 0bd6aea560fe9f7965387dc314fafad50875aecb |
| Item.sol | 1319488b6f9f18d3b91ca26336a9ff77c6d94b36 |
| RatingComputer.sol | ba4dbd0519fc4f9c0640638d04d36d8656da3297 |
| RatingLibrary.sol | a9f979023d665a56fa0453876ceba6879406561b |
| RatingSystem.sol | 3aaee11b90d3f0103b2842b518113273f818bb97 |
| User.sol | 8e64d969ce73ef89129d3b685b6d1374d45aa55a |


### Contracts Description Table


|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **AssetStorage** | Implementation |  |||
| └ | insert | Public ❗️ | 🛑  | |
| └ | remove | Public ❗️ | 🛑  | |
| └ | isIn | Public ❗️ |   | |
| └ | getCount | External ❗️ |   | |
| └ | getAssets | External ❗️ |   | |
||||||
| **StoragePointer** | Implementation | AssetStorage |||
| └ | insert | Public ❗️ | 🛑  | |
| └ | remove | Public ❗️ | 🛑  | |
| └ | isIn | Public ❗️ |   | |
| └ | getCount | External ❗️ |   | |
| └ | getAssets | External ❗️ |   | |
| └ | getKeyAt | External ❗️ |   | |
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
| └ | changeOwner | External ❗️ | 🛑  | isOwner |
||||||
| **Permissioned** | Implementation | Ownable |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | Ownable |
| └ | grantPermission | External ❗️ | 🛑  | isOwner |
| └ | revokePermission | Public ❗️ | 🛑  | |
| └ | checkForPermission | Public ❗️ |   | |
| └ | getMyPolicy | External ❗️ |   | |
||||||
| **Item** | Implementation | Permissioned |||
| └ | \<Constructor\> | Public ❗️ | 🛑  | Permissioned |
| └ | rate | External ❗️ | 🛑  | |
| └ | changeComputer | External ❗️ | 🛑  | isOwner |
| └ | computeRate | External ❗️ |   | |
| └ | getAllRatings | External ❗️ |   | |
| └ | ratingCount | External ❗️ |   | |
||||||
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
| └ | createItem | External ❗️ | 🛑  | isOwner |
| └ | deleteItem | External ❗️ | 🛑  | isOwner |
| └ | getItems | External ❗️ |   | |
| └ | isIn | External ❗️ |   | |
| └ | itemCount | External ❗️ |   | |
| └ | getItemByIndex | External ❗️ |   | |


### Legend

|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
