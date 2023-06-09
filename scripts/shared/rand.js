
var nRand=0;
global.InitRandom=function(set)
{
    if(set===undefined)
        set=123;
    nRand=+set;
}

global.Random=function(max)
{
    nRand=(nRand*1664525+1013904223) >>> 0;
    return nRand % max;
}
InitRandom();

