local procfs = require("lj2procfs.procfs")

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
data = ""

local function jsonfyValue(avalue, indent, name)
  if not avalue then return end;

  indent = indent or ""

  if type(avalue) == "table" then
    if name then
      	data = data..'\n\t"'..name..'": {'
    else
    	data = data.."\n\t{"
    end

    if #avalue > 0 then
      for _, value in ipairs(avalue) do
        jsonfyValue(value, indent..'    ')
      end
    else
      -- assume it's a dictionary, so use pairs
      for key, value in pairs(avalue) do
        jsonfyValue(value, indent..'    ', key)
      end
    end
    if tLength == counter then
      	data = data.."\n\t}"
    else
      	data = data.."\n\t},"
      counter = counter + 1
    end
  else
    if name then
      if last == false then
        data = data..'\n\t\t"'..name..'":'..literalForValue(avalue)..","
        last = true
      else
	data = data..'\n\t\t"'..name..'":'..literalForValue(avalue)
        last = false
      end
    else
      	data = data..'\n\t"'..literalForValue(avalue)..'",'
    end
  end
end

if not filename then USAGE() end

jsonfyValue(procfs[filename], " ", filename)
local file = io.open("data.json", "w")
file:write("{\n\t"..data.."\n}")
file:close()
