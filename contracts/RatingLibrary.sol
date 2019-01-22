pragma solidity < 0.5.3;

library RatingLibrary {

    // Rating data bundle
    struct Rating {
        bool isValid;
        uint8 score;
        address rater;
        address rated;
        uint timestamp;
        // Other data to define
    }
}
