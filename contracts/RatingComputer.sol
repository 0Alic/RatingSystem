pragma solidity ^0.5.0;

/// @title RatingComputer
/// @notice This contract interface defines the method to compute the final score of a list of scores
interface RatingComputer {

    modifier haveEqualLength(uint[] memory _s, uint[] memory _b, address[] memory _r) {

        require(_s.length == _b.length && _b.length == _r.length);
        _;
    }

    /// @notice Compute the final score given a bundle of rating information
    /// @param _scores The array of scores (1 to 10)
    /// @param _blocks The array of blocks containing the scores
    /// @param _raters The raters connected to the scores
    function compute(uint[] calldata _scores, 
                     uint[] calldata _blocks, 
                     address[] calldata _raters) external pure returns(uint);
}


/// @title SimpleAverageComputer
/// @notice Compute the final score of a list of scores using the simple average formula
contract SimpleAvarageComputer is RatingComputer {
    
    function compute(uint[] calldata _scores, 
                     uint[] calldata _blocks, 
                     address[] calldata _raters) haveEqualLength(_scores, _blocks, _raters) external pure returns(uint) {

        uint len = _scores.length;

        if (len <= 0) 
            return 0;
 
        // Simple average
        uint total = 0;

        for (uint i=0; i<len; i++)
            total += _scores[i];

        return total / len;
    }
}


/// @title WeightedAverageComputer
/// @notice Compute the final score of a list of scores using a weighted average formula, assigning less weight to newer scores
contract WeightedAverageComputer is RatingComputer {

    function compute(uint[] calldata _scores, 
                     uint[] calldata _blocks, 
                     address[] calldata _raters) haveEqualLength(_scores, _blocks, _raters) external pure returns(uint) {

        uint len = _scores.length;

        if (len <= 0) 
            return 0;
 
        // Weighted average w.r.t. blocks
        uint last = _blocks[len-1];
        uint total = 0;
        uint weightSum = 0;

        for (uint i=0; i<len; i++) {

            uint s = _scores[i];
            uint b = _blocks[i];
            uint weight = (b*100)/last;

            total += s * weight;
            weightSum += weight;
        }

        return total / weightSum;
    }
}
