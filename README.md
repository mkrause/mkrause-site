
# mkrause-site

Source code for mkrause.nl.


## Local setup

First, get a copy of the source code.

    $ git clone [...]

The easiest way to get a development environment is by using Vagrant:

    $ vagrant up

This might take a while if you don't already have the `wheezy64` base box downloaded.

You'll need to configure the project with some machine-specific information. There's a "workflow" script included with the project that can help you create and edit the right files:

    ./wf configure

Install any dependencies:

    ./wf update

Finally, run the project:

    ./wf run
