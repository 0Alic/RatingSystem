pragma solidity ^0.5.0;

/// @title RatingComputer
/// @notice This contract interface defines the method to compute the final score of a list of scores
interface RatingComputer {

    function compute(uint[] calldata _scores) external pure returns(uint);
}


/// @title SimpleAverageComputer
/// @notice Compute the final score of a list of scores using the simple average formula
contract SimpleAvarageComputer is RatingComputer {
    
    // Questa funzione sembra un po' lenta
    function compute(uint[] calldata _scores) external pure returns(uint) {

        if (_scores.length <= 0) 
            return 0;
 
        // Simple average
        uint total = 0;

        for (uint i=0; i<_scores.length; i++) {
            total += _scores[i];
        }

        return total / _scores.length;
    }
}

/// @title WeightedAverageComputer
/// @notice Compute the final score of a list of scores using a weighted average formula, assigning less weight to newer scores
contract WeightedAverageComputer is RatingComputer {

    function compute(uint[] calldata _scores) external pure returns(uint) {

        if (_scores.length <= 0) 
            return 0;

        // Give more weight to newer scores (i.e. at the end of the array)
        uint weight = 1;
        uint weightSum = 0;
        uint total = 0;

        for (uint i=0; i<_scores.length; i++) {
            total += _scores[i]*weight;
            weightSum += weight;
            weight++;
        }
        
        return total / weightSum;
    } 
}