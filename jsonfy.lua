local procfs = require("lj2procfs.procfs")
local putil = require("lj2procfs.print-util")

local function USAGE()
  print ([[

  USAGE: 
    $ sudo ./procfile [PID] <filename>

  where <filename> is the name of a file in the /proc
  directory.

  Example:
    $ sudo ./procfile cpuinfo
    $ sudo ./procfile 13654 limits
  ]])

  error() 
end

local filename = nil
local PID = nil

if tonumber(arg[1]) then
  PID = tonumber(arg[1])
  filename = arg[2]
else
  filename = arg[1]
end

function tablelength(T)
  local count = 0
  for _ in pairs(T) do count = count + 1 end
  return count
end

tLength = tablelength(procfs[filename])

local function literalForValue(avalue)
  if type(avalue) ==  '"number"' or type(avalue) == '"boolean"' then
    return tostring(avalue)
  end

  local str = tostring(avalue)
  if str == "" then
    return '""'
  end

  return string.format('"%s"', str)

end

last = false
counter = 1

local function jsonfyValue(avalue, indent, name)
  if not avalue then return end;

  indent = indent or ""

  if type(avalue) == "table" then
    if name then
      print(string.format('%s"%s" : {', indent, name))
    else
      print(string.format("%s{", indent))
    end

    if #avalue > 0 then
      -- it's a list,so use ipairs
      for _, value in ipairs(avalue) do
        jsonfyValue(value, indent..'    ')
      end
    else
      -- assume it's a dictionary, so use pairs
      for key, value in pairs(avalue) do
        jsonfyValue(value, indent..'    ', key)
        --tablesize = tablesize + 1
      end
    end
    if tLength == counter then
      print(string.format("%s}", indent))
    else 
      print(string.format("%s},", indent))
      counter = counter + 1
    end
  else 
    if name then
      if last == false then
        print(string.format('%s"%s":%s,', indent, name, literalForValue(avalue)))
        last = true
      else
        print(string.format('%s"%s":%s', indent, name, literalForValue(avalue)))
        last = false
      end
    else
      print(string.format("%s%s,", indent, literalForValue(avalue)))
    end
  end
end

if not filename then USAGE() end

print("{")
if PID then
  jsonfyValue(procfs[PID][filename], ' ', tostring(PID).."_"..filename)
else
  jsonfyValue(procfs[filename], " ", filename)
end
print("}")


