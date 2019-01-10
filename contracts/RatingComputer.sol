pragma solidity ^0.5.0;

contract RatingComputer {

    function compute(uint[] memory _scores) public pure returns(uint);
}

contract SimpleAvarageComputer is RatingComputer {
    
    function compute(uint[] memory _scores) public pure returns(uint) {

        // Simple average
        require(_scores.length > 0, "Need positive number of scores");

        uint total = 0;

        for(uint i=0; i<_scores.length; i++)
            total += _scores[i];

        return total / _scores.length;
    }    
}