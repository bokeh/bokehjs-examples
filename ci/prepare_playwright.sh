#!/usr/bin/env bash
#
# Prepare and run playwright tests in all example directories.

set -eux

./single_example.sh typescript vanilla_rspack
./single_example.sh typescript vanilla_webpack
